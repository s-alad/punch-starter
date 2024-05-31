
module sui_crowdfund::sui_crowdfund {
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::balance::Balance;

    /// Represents one fund from a funder. A project looking for funds may have any number of funds
    public struct Fund has drop, store {
        amount: u64,
        funder: address,
    }

    /// Represents one milestone in the project. A project may have any number of milestones
    public struct Milestone has store {
        creator_already_took_funds: bool,
        fund_goal: u64,
        complete_votes: u64,
        complete_voters: vector<address>,
    }

    /// Represents a project that may be looking for funds.
    public struct Project has key, store {
        id: UID,
        owner: address,
        funds: vector<Fund>,
        milestones: vector<Milestone>,
        balance: Balance<SUI>,
        total_funds: u64,
        fund_goal: u64,
        freeze_votes: u64,
        freeze_voters: vector<address>,
        frozen: bool,
    }

    /// A "coin" owned by a specific project's creator. 
    public struct ProjectOwner has key, store {
        id: UID,
        owner: address,
    }

    /// An event emitted when a new project is created
    public struct ProjectCreateEvent has copy, drop {
        project_id: ID,
    }

    /// Returns true if the project has received enough funds to meet its goal
    public fun is_funded(project: &Project): bool {
        project.total_funds >= project.fund_goal
    }

    ///  Returns true if the current context is the owner of the project
    public fun is_owner(project_owner: &ProjectOwner, project: &Project): bool {
        &project.owner == project_owner.owner
    }

    /// Instantiates an empty project
    public fun create_project(
        ctx: &mut TxContext,
    ): ProjectOwner {

        let owner = ProjectOwner {
            id: object::new(ctx),
            owner: ctx.sender(),
        };

        let project = Project {
            id: object::new(ctx),
            owner: ctx.sender(),
            funds: vector::empty<Fund>(),
            milestones: vector::empty<Milestone>(),
            balance: sui::balance::zero<SUI>(),
            total_funds: 0,
            fund_goal: 0,
            freeze_votes: 0,
            freeze_voters: vector::empty<address>(),
            frozen: false,
        };

        let project_event = ProjectCreateEvent {
            project_id: project.id.uid_to_inner(),
        };
        sui::event::emit(project_event);

        // We need to make sure that the project is PUBLICLY available for users who want to fund it
        transfer::share_object(project);

        owner
    }

    /// Adds a new milestone to the project, with a fund goal. 
    /// By passing a reference to the project owner, we can ensure that only the creator of the project can add milestones
    public fun add_milestone(
        project_owner: &mut ProjectOwner,
        project: &mut Project,
        fund_goal: u64,
    ) {
        assert!(!project.frozen, 1);
        assert!(is_owner(project_owner, project), 2);

        project.milestones.push_back(Milestone {
            creator_already_took_funds: false,
            fund_goal: fund_goal,
            complete_votes: 0,
            complete_voters: vector::empty<address>(),
        });
        project.fund_goal = project.fund_goal + fund_goal;
    }

    /// Used by funders to fund a project they like
    public fun add_fund(
        ctx: &mut TxContext,
        project: &mut Project,
        coin: Coin<SUI>,
    ) {
        assert!(!project.frozen, 1);

        // destroys the coin and converts it to a balance
        let balance = coin.into_balance();
        let balance_value: u64 = balance.value();
        project.balance.join(balance);

        project.funds.push_back(Fund {
            amount: balance_value,
            funder: ctx.sender(),
        });
    }  

    /// Used by funders to vote on a milestone being complete.
    public fun vote_complete(
        ctx: &mut TxContext,
        project: &mut Project,
        milestone_index: u64,
    ) {
        assert!(project.total_funds >= project.fund_goal, 1);
        assert!(!project.frozen, 2);
        assert!(project.milestones.length() > milestone_index, 3);

        // Make sure they haven't already voted
        let mut i: u64 = 0;
        while (i < project.milestones[milestone_index].complete_voters.length()) {
            let voter_address = project.milestones[milestone_index].complete_voters[i];
            assert!(voter_address != ctx.sender(), 4);
            i = i + 1;
        };

        let mut votes: u64 = 0;
        i = 0;
        while (i < project.funds.length()) {
            if (project.funds[i].funder == ctx.sender()) {
                votes = votes + project.funds[i].amount;
            };

            i = i + 1;
        };

        // Find the milestone
        let milestone = &mut project.milestones[milestone_index];
        milestone.complete_votes = milestone.complete_votes + votes;
    }

    public fun redeem_milestone(
        ctx: &mut TxContext,
        project_owner: &ProjectOwner,
        project: &mut Project,
        milestone_index: u64,
    ): Coin<SUI> {
        assert!(is_owner(project_owner, project), 1);
        assert!(project.milestones.length() > milestone_index, 2);
        let milestone = &mut project.milestones[milestone_index];
        assert!(milestone.complete_votes > project.fund_goal / 2, 3);
        assert!(!milestone.creator_already_took_funds, 4);

        milestone.creator_already_took_funds = true;
        let reward_balance = project.balance.split(project.fund_goal);
        
        sui::coin::from_balance(reward_balance, ctx)
    }

    /// Used by funders to attempt to revoke their funding, if the project is suspicious 
    public fun vote_freeze(
        ctx: &mut TxContext,
        project: &mut Project,
    ) {
        // A project can only be frozen if it has been fully funded
        assert!(is_funded(project), 1);
        assert!(!project.frozen, 2);

        // Make sure they haven't already voted
        let mut i: u64 = 0;
        while (i < project.freeze_voters.length()) {
            assert!(project.freeze_voters[i] != ctx.sender(), 3);
            i = i + 1;
        };

        // loop through all project funds, and sum the votes. This accounts for when a funder has multiple funds
        let mut votes: u64 = 0;
        let mut i: u64 = 0;
        while (i < project.funds.length()) {
            let fund = &project.funds[i];
            if (fund.funder == ctx.sender()) {
                votes = votes + fund.amount;
            };

            i = i + 1;
        };

        // Check if the weighted sum of votes is greater than 75% of the total funds
        project.freeze_votes = project.freeze_votes + votes;
        project.freeze_voters.push_back(ctx.sender());

        if (project.freeze_votes > project.total_funds * 3 / 4) {
            project.frozen = true;
        };
    }

    /// Used by funders after a project is already frozen to get their funds back
    public fun getRefund(
        ctx: &mut TxContext,
        project: &mut Project,
    ): Coin<SUI> {
        assert!(project.frozen, 1);

        let mut i: u64 = 0;
        let mut return_funds: u64 = 0;
        while (i < project.funds.length()) {
            let fund = &project.funds[i];
            if (fund.funder == ctx.sender()) {
                return_funds = return_funds + fund.amount;
            };

            i = i + 1;
        };

        let refund = project.balance.split(return_funds);

        sui::coin::from_balance(refund, ctx)
    }
}
