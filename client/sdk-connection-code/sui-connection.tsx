import { ConnectButton, useWallet } from "@suiet/wallet-kit";

import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useEffect } from "react";
import { SuiAdapter } from "./SuiAdapter";
import { ConnectionAdapter } from "./ConnectionAdapter";

export const SuiWalletConnect = () => {
  const adapter = ConnectionAdapter.createConnectionAdapter("SUI");
  return (
    <div style={{margin: 10, padding: 10, border: '1px solid black', borderRadius: 10}}>
      <h4>Sui Wallet</h4>
      <ConnectButton></ConnectButton>
      <div>
        <button
          onClick={() => {
            adapter.createProject();
          }}
          >Create Project</button>
      </div>
    </div>
  );
};
