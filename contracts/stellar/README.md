# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

- New Soroban contracts can be put in `contracts`, each in their own directory. There is already a `hello_world` contract in there to get you started.
- If you initialized this project with any other example contracts via `--with-example`, those contracts will be in the `contracts` directory as well.
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.
- Frontend libraries can be added to the top-level directory as well. If you initialized this project with a frontend template via `--frontend-template` you will have those files already included.

Run in contracts/stellar/

soroban contract build
cargo test
soroban contract install \
  --network testnet \
  --source alice \
  --wasm target/wasm32-unknown-unknown/release/punchstarter.wasm


soroban contract deploy \
  --wasm-hash d1f31fa604e94038dc74ae75e669696f799dc9d9aa5d2024ab8bed88953e0670 \
  --source alice \
  --network testnet

CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE

soroban contract invoke \
  --id CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE \
  --source alice \
  --network testnet \
  -- \
  create_project \
  --owner GBTOUSH4LUEV7SPKNLXTUIMCE6ACNHB7LFP3JSZZKIELSMNSRBKQCX2E \
  --goal 1234

soroban contract invoke \
  --id CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE \
  --source alice \
  --network testnet \
  -- \
  get_project

soroban contract invoke \
  --id CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE \
  --source alice \
  --network testnet \
  -- \
  add_fund \
  --funder GBTOUSH4LUEV7SPKNLXTUIMCE6ACNHB7LFP3JSZZKIELSMNSRBKQCX2E \
  --amount 100

soroban contract invoke \
  --id CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE \
  --source alice \
  --network testnet \
  -- \
  vote_freeze \
  --funder GBTOUSH4LUEV7SPKNLXTUIMCE6ACNHB7LFP3JSZZKIELSMNSRBKQCX2E \
  --votes 10

soroban contract invoke \
  --id CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE \
  --source alice \
  --network testnet \
  -- \
  claim_milestone \
  --milestone_index 0

soroban contract invoke \
  --id CBY7HQJTR5XBMWRIGFVULVR4PJOSYC5WIDB7AAMLCMLTMZQ74BWDPDGE \
  --source alice \
  --network testnet \
  -- \
  add_milestone \
  --name "Deploy to testnet" \
  --amount 300 \
  --description "Deploy smart contract to testnet"

Working hello contract:

soroban contract invoke \
  --id CALDCP7TEUU2Z463ONMGAXCOK6K4KDVGKX47AQLUFOOSBY6AIJTK25OA \
  --source alice \
  --network testnet \
  -- \
  hello \
  --to RPC

Working increment contract:

soroban contract invoke \
  --id CA5JWSXCSIJXCHRSKH2C52L3WH4DB33BIPCSJRTRVN57NTQVTMT44SK3 \
  --source alice \
  --network testnet \
  -- \
  increment

soroban contract invoke \
  --id CA5JWSXCSIJXCHRSKH2C52L3WH4DB33BIPCSJRTRVN57NTQVTMT44SK3 \
  --source alice \
  --network testnet \
  -- \
  decrement

soroban contract invoke \
  --id CA5JWSXCSIJXCHRSKH2C52L3WH4DB33BIPCSJRTRVN57NTQVTMT44SK3 \
  --source alice \
  --network testnet \
  -- \
  reset