import { ConnectButton, useWallet } from "@suiet/wallet-kit";

// import {TransactionBlock} from "@mysten/sui.js";
import { useEffect } from "react";

export const SuiWalletConnect = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) return;
    console.log("connected wallet name: ", wallet.name);
    console.log("account address: ", wallet.account?.address);
    console.log("account publicKey: ", wallet.account?.publicKey);
  }, [wallet.connected]);

  // launch a move call for the connected account via wallet
  //   async function handleMoveCall() {
  //     const tx = new TransactionBlock();
  //     const packageObjectId = "0x1";
  //     tx.moveCall({
  //       target: `${packageObjectId}::nft::mint`,
  //       arguments: [tx.pure("Example NFT")],
  //     });
  //     await wallet.signAndExecuteTransactionBlock({
  //       transactionBlock: tx,
  //     });
  //   }

  // launch a move call for the connected account via wallet
  async function handleSignMessage() {
    await wallet.signPersonalMessage({
      message: new TextEncoder().encode("Hello World"),
    });
  }

  return (
    <div style={{margin: 20}}>
      <h4>Sui</h4>
      <ConnectButton></ConnectButton>
      {wallet.connected && (
        <button
          onClick={() => {
            handleSignMessage();
          }}
        >
          Sign Message
        </button>
      )}
    </div>
  );
};
