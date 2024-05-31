#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, Env, Symbol, Address, Vec, vec};

const OWNER: Symbol = symbol_short!("OWNER");
const FUND_AMT: Symbol = symbol_short!("FUND_AMT");
const FUNDERS: Symbol = symbol_short!("FUNDERS");
const TOT_FUNDS: Symbol = symbol_short!("TOT_FUNDS");
const GOAL: Symbol = symbol_short!("GOAL");
const FRZ_VOTE: Symbol = symbol_short!("FRZ_VOTE");
const FRZ_VOTER: Symbol = symbol_short!("FRZ_VOTER");
const FROZEN: Symbol = symbol_short!("FROZEN");

const MILESTONE_NAMES: Symbol = symbol_short!("MILE_NM");
const MILESTONE_AMOUNTS: Symbol = symbol_short!("MILE_AMT");
const MILESTONE_DESCRIPTIONS: Symbol = symbol_short!("MILE_DESC");
const MILESTONE_CLAIMED: Symbol = symbol_short!("MILE_CLM");

const PROJECT_VOTES: Symbol = symbol_short!("PRJ_VTS");

#[contract]
pub struct CrowdfundContract;

#[contractimpl]
impl CrowdfundContract {
    pub fn create_project(env: Env, owner: Address, goal: u64) {
        env.storage().instance().set(&OWNER, &owner);
        env.storage().instance().set(&FUND_AMT, &Vec::<u64>::new(&env));
        env.storage().instance().set(&FUNDERS, &Vec::<Address>::new(&env));
        env.storage().instance().set(&TOT_FUNDS, &0u64);
        env.storage().instance().set(&GOAL, &goal);
        env.storage().instance().set(&FRZ_VOTE, &0u64);
        env.storage().instance().set(&FRZ_VOTER, &Vec::<Address>::new(&env));
        env.storage().instance().set(&FROZEN, &false);

        env.storage().instance().set(&MILESTONE_NAMES, &Vec::<Symbol>::new(&env));
        env.storage().instance().set(&MILESTONE_AMOUNTS, &Vec::<u64>::new(&env));
        env.storage().instance().set(&MILESTONE_DESCRIPTIONS, &Vec::<Symbol>::new(&env));
        env.storage().instance().set(&MILESTONE_CLAIMED, &Vec::<u64>::new(&env));

        env.storage().instance().set(&PROJECT_VOTES, &0u64);

        log!(&env, "Project created with owner: {:?}, goal: {}", owner, goal);
    }

    pub fn get_project(env: Env) {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        let fund_amt: Vec<u64> = env.storage().instance().get(&FUND_AMT).unwrap();
        let funders: Vec<Address> = env.storage().instance().get(&FUNDERS).unwrap();
        let tot_funds: u64 = env.storage().instance().get(&TOT_FUNDS).unwrap();
        let goal: u64 = env.storage().instance().get(&GOAL).unwrap();
        let frz_vote: u64 = env.storage().instance().get(&FRZ_VOTE).unwrap();
        let frz_voter: Vec<Address> = env.storage().instance().get(&FRZ_VOTER).unwrap();
        let frozen: bool = env.storage().instance().get(&FROZEN).unwrap();

        let milestone_names: Vec<Symbol> = env.storage().instance().get(&MILESTONE_NAMES).unwrap();
        let milestone_amounts: Vec<u64> = env.storage().instance().get(&MILESTONE_AMOUNTS).unwrap();
        let milestone_descriptions: Vec<Symbol> = env.storage().instance().get(&MILESTONE_DESCRIPTIONS).unwrap();
        let milestone_claimed: Vec<u64> = env.storage().instance().get(&MILESTONE_CLAIMED).unwrap();

        let project_votes: u64 = env.storage().instance().get(&PROJECT_VOTES).unwrap();

        log!(&env, "Owner: {:?}", owner);
        log!(&env, "Fund Amounts: {:?}", fund_amt);
        log!(&env, "Funders: {:?}", funders);
        log!(&env, "Total Funds: {}", tot_funds);
        log!(&env, "Goal: {}", goal);
        log!(&env, "Freeze Votes: {}", frz_vote);
        log!(&env, "Freeze Voters: {:?}", frz_voter);
        log!(&env, "Frozen: {}", frozen);

        log!(&env, "Milestone Names: {:?}", milestone_names);
        log!(&env, "Milestone Amounts: {:?}", milestone_amounts);
        log!(&env, "Milestone Descriptions: {:?}", milestone_descriptions);
        log!(&env, "Milestone Claimed: {:?}", milestone_claimed);

        log!(&env, "Project Votes: {}", project_votes);
    }

    pub fn add_fund(env: Env, amount: u64, funder: Address) {
        let mut fund_amt: Vec<u64> = env.storage().instance().get(&FUND_AMT).unwrap();
        let mut funders: Vec<Address> = env.storage().instance().get(&FUNDERS).unwrap();
        let mut tot_funds: u64 = env.storage().instance().get(&TOT_FUNDS).unwrap();

        fund_amt.push_back(amount);
        funders.push_back(funder.clone());
        tot_funds += amount;

        env.storage().instance().set(&FUND_AMT, &fund_amt);
        env.storage().instance().set(&FUNDERS, &funders);
        env.storage().instance().set(&TOT_FUNDS, &tot_funds);

        log!(&env, "Fund added by {:?} of amount: {}. Total funds: {}", funder, amount, tot_funds);
    }

    pub fn add_milestone(env: Env, name: Symbol, amount: u64, description: Symbol) {
        let mut milestone_names: Vec<Symbol> = env.storage().instance().get(&MILESTONE_NAMES).unwrap();
        let mut milestone_amounts: Vec<u64> = env.storage().instance().get(&MILESTONE_AMOUNTS).unwrap();
        let mut milestone_descriptions: Vec<Symbol> = env.storage().instance().get(&MILESTONE_DESCRIPTIONS).unwrap();
        let mut milestone_claimed: Vec<u64> = env.storage().instance().get(&MILESTONE_CLAIMED).unwrap();

        milestone_names.push_back(name.clone());
        milestone_amounts.push_back(amount);
        milestone_descriptions.push_back(description);

        env.storage().instance().set(&MILESTONE_NAMES, &milestone_names);
        env.storage().instance().set(&MILESTONE_AMOUNTS, &milestone_amounts);
        env.storage().instance().set(&MILESTONE_DESCRIPTIONS, &milestone_descriptions);

        log!(&env, "Milestone added: {} - {}", name, amount);
    }

    pub fn claim_milestone(env: Env, milestone_index: u32) {
        let mut milestone_claimed: Vec<u64> = env.storage().instance().get(&MILESTONE_CLAIMED).unwrap();

        milestone_claimed.push_back(milestone_index as u64);

        env.storage().instance().set(&MILESTONE_CLAIMED, &milestone_claimed);

        log!(&env, "Milestone {} claimed", milestone_index);
    }

    pub fn vote_freeze(env: Env, funder: Address, votes: u64) {
        let mut frz_vote: u64 = env.storage().instance().get(&FRZ_VOTE).unwrap();
        let mut frz_voter: Vec<Address> = env.storage().instance().get(&FRZ_VOTER).unwrap();

        frz_vote += votes;
        frz_voter.push_back(funder.clone());

        env.storage().instance().set(&FRZ_VOTE, &frz_vote);
        env.storage().instance().set(&FRZ_VOTER, &frz_voter);

        log!(&env, "Freeze vote by {:?} with {} votes. Total freeze votes: {}", funder, votes, frz_vote);
    }

    pub fn vote_project(env: Env, funder: Address, votes: u64) {
        let mut project_votes: u64 = env.storage().instance().get(&PROJECT_VOTES).unwrap();

        project_votes += votes;

        env.storage().instance().set(&PROJECT_VOTES, &project_votes);

        log!(&env, "Project vote by {:?} with {} votes. Total project votes: {}", funder, votes, project_votes);
    }
}
