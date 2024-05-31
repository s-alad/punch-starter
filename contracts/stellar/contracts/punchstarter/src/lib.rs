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

        log!(&env, "Owner: {:?}", owner);
        log!(&env, "Fund Amounts: {:?}", fund_amt);
        log!(&env, "Funders: {:?}", funders);
        log!(&env, "Total Funds: {}", tot_funds);
        log!(&env, "Goal: {}", goal);
        log!(&env, "Freeze Votes: {}", frz_vote);
        log!(&env, "Freeze Voters: {:?}", frz_voter);
        log!(&env, "Frozen: {}", frozen);
    }

    pub fn add_fund(env: Env, amount: u64, funder: Address) {
        let mut fund_amt: Vec<u64> = env.storage().instance().get(&FUND_AMT).unwrap();
        let mut funders: Vec<Address> = env.storage().instance().get(&FUNDERS).unwrap();
        let mut tot_funds: u64 = env.storage().instance().get(&TOT_FUNDS).unwrap();

        fund_amt.append(&mut vec![&env, amount]);
        funders.append(&mut vec![&env, funder.clone()]);
        tot_funds += amount;

        env.storage().instance().set(&FUND_AMT, &fund_amt);
        env.storage().instance().set(&FUNDERS, &funders);
        env.storage().instance().set(&TOT_FUNDS, &tot_funds);

        log!(&env, "Fund added by {:?} of amount: {}. Total funds: {}", funder, amount, tot_funds);
    }
}
