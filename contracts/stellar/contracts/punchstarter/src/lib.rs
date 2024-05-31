#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec, Address, Map};

#[contract]
pub struct CrowdfundContract;

#[derive(Debug)]
pub struct Fund {
    amount: u64,
    funder: Address,
}

#[derive(Debug)]
pub struct Milestone {
    creator_already_took_funds: bool,
    fund_goal: u64,
    complete_votes: u64,
    complete_voters: Vec<Address>,
}

#[derive(Debug)]
pub struct Project {
    owner: Address,
    // funds: Vec<Fund>,
    // milestones: Vec<Milestone>,
    total_funds: u64,
    fund_goal: u64,
    freeze_votes: u64,
    // freeze_voters: Vec<Address>,
    frozen: bool,
}

#[contractimpl]
impl CrowdfundContract {
    // pub fn create_project(env: Env, owner: Address) -> Project {
    //     Project {
    //         owner,
    //         funds: Vec::new(&env),
    //         milestones: Vec::new(&env),
    //         total_funds: 0,
    //         fund_goal: 0,
    //         freeze_votes: 0,
    //         freeze_voters: Vec::new(&env),
    //         frozen: false,
    //     }
    // }

    // pub fn add_milestone(project: &mut Project, fund_goal: u64) {
    //     assert!(!project.frozen, "Project is frozen");

    //     project.milestones.push(Milestone {
    //         creator_already_took_funds: false,
    //         fund_goal,
    //         complete_votes: 0,
    //         complete_voters: Vec::new(&project.milestones.env()),
    //     });
    //     project.fund_goal += fund_goal;
    // }

    // pub fn add_fund(project: &mut Project, amount: u64, funder: Address) {
    //     assert!(!project.frozen, "Project is frozen");

    //     project.total_funds += amount;

    //     project.funds.push(Fund {
    //         amount,
    //         funder,
    //     });
    // }

    // pub fn vote_complete(project: &mut Project, milestone_index: usize, voter: Address) {
    //     assert!(project.total_funds >= project.fund_goal, "Project is not fully funded");
    //     assert!(!project.frozen, "Project is frozen");
    //     assert!(milestone_index < project.milestones.len(), "Invalid milestone index");

    //     let milestone = &mut project.milestones[milestone_index];

    //     assert!(
    //         !milestone.complete_voters.contains(&voter),
    //         "Voter has already voted"
    //     );

    //     let votes: u64 = project
    //         .funds
    //         .iter()
    //         .filter(|fund| fund.funder == voter)
    //         .map(|fund| fund.amount)
    //         .sum();

    //     milestone.complete_votes += votes;
    //     milestone.complete_voters.push(voter);
    // }

    // pub fn redeem_milestone(project: &mut Project, milestone_index: usize, owner: Address) -> u64 {
    //     assert!(project.owner == owner, "Only owner can redeem milestone");
    //     assert!(milestone_index < project.milestones.len(), "Invalid milestone index");

    //     let milestone = &mut project.milestones[milestone_index];
    //     assert!(
    //         milestone.complete_votes > project.fund_goal / 2,
    //         "Not enough votes to complete milestone"
    //     );
    //     assert!(!milestone.creator_already_took_funds, "Funds already taken");

    //     milestone.creator_already_took_funds = true;
    //     project.fund_goal
    // }

    // pub fn vote_freeze(project: &mut Project, voter: Address) {
    //     assert!(project.total_funds >= project.fund_goal, "Project is not fully funded");
    //     assert!(!project.frozen, "Project is already frozen");

    //     assert!(
    //         !project.freeze_voters.contains(&voter),
    //         "Voter has already voted to freeze"
    //     );

    //     let votes: u64 = project
    //         .funds
    //         .iter()
    //         .filter(|fund| fund.funder == voter)
    //         .map(|fund| fund.amount)
    //         .sum();

    //     project.freeze_votes += votes;
    //     project.freeze_voters.push(voter);

    //     if project.freeze_votes > project.total_funds * 3 / 4 {
    //         project.frozen = true;
    //     }
    // }

    // pub fn get_refund(project: &mut Project, funder: Address) -> u64 {
    //     assert!(project.frozen, "Project is not frozen");

    //     let refund: u64 = project
    //         .funds
    //         .iter()
    //         .filter(|fund| fund.funder == funder)
    //         .map(|fund| fund.amount)
    //         .sum();

    //     project.total_funds -= refund;
    //     refund
    // }
}
