import { ConnectButton, useWallet } from "@suiet/wallet-kit";

import { TransactionBlock } from '@mysten/sui.js/transactions';
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
    async function example() {
      const tx = new TransactionBlock();
      const packageObjectId = "0x1";
      tx.moveCall({
        target: `${packageObjectId}::nft::mint`,
        arguments: [tx.pure("Example NFT")],
      });
      await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
    }

  async function handleSignAndExecuteTxBlock() {
    if (!wallet.connected) return

    // define a programmable transaction
    const tx = new TransactionBlock();
    const packageObjectId = "0x895e5f5bb0a4d433694b66ded5658363ac452195c9d08de984aeeccf6154a04f";
    tx.moveCall({
      target: `${packageObjectId}::crowd_funding_project::create_project`,
      arguments: [tx.pure("Example NFT")],
    });

    try {
      // execute the programmable transaction
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('nft minted successfully!', resData);
      alert('Congrats! your nft is minted!')
    } catch (e) {
      console.error('nft mint failed', e);
    }
  }

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
      {wallet.connected && (<div>
        <button
          onClick={() => {
            handleSignMessage();
          }}
        >
          Sign Message
        </button>
        <button onClick={() => {
            example();
          }}>
        Example Call
        </button>
        <button
          onClick={() => {
            handleSignAndExecuteTxBlock();
          }}
          >Create Project</button>
        
      </div>)}
    </div>
  );
};
