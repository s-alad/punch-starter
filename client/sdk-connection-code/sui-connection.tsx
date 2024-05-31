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
        transactionBlock: tx as any,
      });
    }

  async function handleSignAndExecuteTxBlock() {
    if (!wallet.connected) return

    // define a programmable transaction
    const tx = new TransactionBlock();
    const packageObjectId = "0xd32d8b0620fec07205bc62ff76bea0b3b4af372c7b3ef002065517df878ab075";
    tx.moveCall({
      target: `${packageObjectId}::sui_crowdfund::create_project`,
      arguments: [],
    });

    try {
      // execute the programmable transaction
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx as any,
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
      message: new TextEncoder().encode("Welcome to Punch Starter!"),
    });
  }

  return (
    <div style={{margin: 10, padding: 10, border: '1px solid black', borderRadius: 10}}>
      <h4>Sui Wallet</h4>
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
