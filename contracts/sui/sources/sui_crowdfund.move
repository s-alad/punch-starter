
module sui_crowdfund::crowd_funding_project {
    //use std::signer;
    //use std::event;

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
    public struct Project has store {
        creator: address,
        funds: vector<Fund>,
        milestones: vector<Milestone>,
        total_funds: u64,
        fund_goal: u64,
        freeze_votes: u64,
        freeze_voters: vector<address>,
        frozen: bool,
    }

    /// A "coin" owned by a specific project's creator. 
    public struct ProjectOwner has key, store {
        id: UID, 
        project: Project,
    }

    /// Instantiates an empty project
    public fun create_project(
        ctx: &mut TxContext,
    ): ProjectOwner {
        let project = Project {
            creator: ctx.sender(),
            funds: vector::empty<Fund>(),
            milestones: vector::empty<Milestone>(),
            total_funds: 0,
            fund_goal: 0,
            freeze_votes: 0,
            freeze_voters: vector::empty<address>(),
            frozen: false,
        };

        let owner = ProjectOwner {
            id: object::new(ctx),
            project: project,
        };

        owner
    }

    /// Adds a new milestone to the project, with a fund goal. 
    /// By passing a reference to the project owner, we can ensure that only the creator of the project can add milestones
    public fun add_milestone(
        project_owner: &mut ProjectOwner,
        fund_goal: u64,
    ) {
        assert!(!project_owner.project.frozen, 1);

        project_owner.project.milestones.push_back(Milestone {
            creator_already_took_funds: false,
            fund_goal: fund_goal,
            complete_votes: 0,
            complete_voters: vector::empty<address>(),
        });
        project_owner.project.fund_goal = project_owner.project.fund_goal + fund_goal;
    }

    /// Used by funders to fund a project they like
    public fun add_fund(
        ctx: &mut TxContext,
        project: &mut Project,
        amount: u64,
    ) {
        assert!(!project.frozen, 1);

        project.funds.push_back(Fund {
            amount: amount,
            funder: ctx.sender(),
        });
        project.total_funds = project.total_funds + amount;
    }  

    /// Used by funders to vote on a milestone being complete.
    public fun vote_complete(
        ctx: &mut TxContext,
        project: &mut Project,
        milestone_index: u64,
    ) {
        assert!(project.total_funds < project.fund_goal, 1);
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
        project_owner: &mut ProjectOwner,
        milestone_index: u64,
    ) {
        let project = &mut project_owner.project;
        assert!(project.milestones.length() > milestone_index, 1);
        let milestone = &mut project.milestones[milestone_index];
        assert!(milestone.complete_votes > project.fund_goal / 2, 2);
        assert!(!milestone.creator_already_took_funds, 3);

        // TODO Actually send the funds to the project owner
        milestone.creator_already_took_funds = true;
    }

    /// Used by funders to attempt to revoke their funding, if the project is suspicious 
    public fun vote_freeze(
        ctx: &mut TxContext,
        project: &mut Project,
    ) {
        // A project can only be frozen if it has been fully funded
        assert!(project.total_funds < project.fund_goal, 1);
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
        }
    }

    /// Used by funders after a project is already frozen to get their funds back
    public fun getRefund(
        ctx: &mut TxContext,
        project: &mut Project,
    ) {
        assert!(project.frozen, 1);

        let mut i: u64 = 0;
        while (i < project.funds.length()) {
            let fund = &project.funds[i];
            if (fund.funder == ctx.sender()) {
                project.total_funds = project.total_funds - fund.amount;
                project.funds.remove(i);

                // TODO Actually send the funds back to the funder
                
                return
            };

            i = i + 1;
        } 
    }
}
