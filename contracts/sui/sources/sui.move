
module sui::crowd_funding_project {
    use std::signer;
    use std::event;
    use std::vector;
    use sui::tx_context;

    /// Represents one fund from a funder. A project looking for funds may have any number of funds
    public struct Fund {
        amount: u64,
        funder: address,
    }

    /// Represents one milestone in the project. A project may have any number of milestones
    public struct Milestone {
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
    }

    /// A "coin" owned by a specific project's creator. 
    public struct ProjectOwner has key, store {
        id: UID, 
        project: &Project,
    }

    /// Instantiates an empty project
    public fun create_project(
        ctx: &mut TxContext,
    ): ProjectOwner {
        Project {
            creator: ctx.sender,
            funds: vector::empty<Fund>(),
            milestones: vector::empty<Milestone>(),
            total_funds: 0,
            fund_goal: 0,
            freeze_votes: 0,
            freeze_voters: vector::empty<address>(),
        }
    }

    /// Adds a new milestone to the project, with a fund goal. 
    /// By passing a reference to the project owner, we can ensure that only the creator of the project can add milestones
    public fun add_milestone(
        project_owner: &mut ProjectOwner,
        fund_goal: u64,
    ) {
        let project = project_owner.project;
        assert!(!project.frozen, 1);

        project.milestones.push(Milestone {
            creator_already_took_funds: false,
            fund_goal: fund_goal,
            complete_votes: 0,
            complete_voters: vector::empty<address>(),
        });
        project.fund_goal += fund_goal;
    }

    /// Used by funders to fund a project they like
    public fun add_fund(
        ctx: &mut TxContext,
        project: &Project,
        amount: u64,
    ) {
        assert!(!project.frozen, 1);

        project.funds.push(Fund {
            amount: amount,
            funder: ctx.sender,
        });
        project.total_funds += amount;
    }  

    /// Used by funders to vote on a milestone being complete.
    public fun vote_complete(
        ctx: &mut TxContext,
        project: &Project,
        milestone_index: u64,
    ) {
        assert!(project.total_funds < project.fund_goal, 1);
        assert!(!project.frozen, 2);
        assert!(project.milestones.length > milestone, 3);
        
        // Make sure they haven't already voted
        let mut i: u64 = 0;
        while (i < project.complete_voters.length) {
            assert!(project.complete_voters.get(i) != ctx.sender, 4);
            i++;
        }

        let mut votes: u64 = 0;
        let mut i: u64 = 0;
        while (i < project.funds.length) {
            let fund = project.funds.get(i);
            if (fund.funder == ctx.sender) {
                votes += fund.amount;
            }

            i++;
        }

        // Find the milestone
        let milestone = project.milestones.get(mileston_index);
        milestone.votes += votes;
    }

    public fun redeem_milestone(
        project_owner: &mut ProjectOwner,
        milestone_index: u64,
    ) {
        let project = project_owner.project;
        assert!(project.milestones.length > milestone, 1);
        let milestone = project.milestones.get(mileston_index);
        assert!(milestone.votes > project.fund_goal / 2, 2);
        assert!(!milestone.creator_already_took_funds, 3);

        // TODO Actually send the funds to the project owner
        milestone.creator_already_took_funds = true;
    }

    /// Used by funders to attempt to revoke their funding, if the project is suspicious 
    public fun vote_freeze(
        ctx: &mut TxContext,
        project: &Project,
    ) {
        // A project can only be frozen if it has been fully funded
        assert!(project.total_funds < project.fund_goal, 1);
        assert!(!project.frozen, 2);

        // Make sure they haven't already voted
        let mut i: u64 = 0;
        while (i < project.freeze_voters.length) {
            assert!(project.freeze_voters.get(i) != ctx.sender, 3);
            i++;
        }

        // loop through all project funds, and sum the votes. This accounts for when a funder has multiple funds
        let mut votes: u64 = 0;
        let mut i: u64 = 0;
        while (i < project.funds.length) {
            let fund = project.funds.get(i);
            if (fund.funder == ctx.sender) {
                votes += fund.amount;
            }

            i++;
        }

        // Check if the weighted sum of votes is greater than 75% of the total funds
        project.freeze_votes += votes;
        project.freeze_voters.push(ctx.sender);

        if (project.freeze_votes > project.total_funds * 3 / 4) {
            project.frozen = true;
        }
    }

    /// Used by funders after a project is already frozen to get their funds back
    public fun getRefund(
        ctx: &mut TxContext,
        project: &Project,
    ) {
        assert!(project.frozen, 1);

        let mut i: u64 = 0;
        while (i < project.funds.length) {
            let fund = project.funds.get(i);
            if (fund.funder == funder_address) {
                project.total_funds -= fund.amount;
                project.funds.remove(i);

                // TODO Actually send the funds back to the funder
                
                return;
            }

            i++;
        } 
    }
}
