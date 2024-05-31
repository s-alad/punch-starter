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

soroban contract deploy \
  --wasm-hash 8d6044d04a3626e19be7dc0a3d145273ab5be05815225907a57013d76abb2d69 \
  --source alice \
  --network testnet

soroban contract invoke \
  --id CA5JWSXCSIJXCHRSKH2C52L3WH4DB33BIPCSJRTRVN57NTQVTMT44SK3 \
  --source alice \
  --network testnet \
  -- \
  increment