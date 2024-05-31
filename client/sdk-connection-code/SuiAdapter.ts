import { TransactionBlock } from "@mysten/sui.js/transactions";
import { WalletContextState, useWallet } from "@suiet/wallet-kit";
import { ConnectionAdapter } from "./ConnectionAdapter";
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export class SuiAdapter extends ConnectionAdapter {

    packageObjectId = "0xd32d8b0620fec07205bc62ff76bea0b3b4af372c7b3ef002065517df878ab075"
    moduleName = "sui_crowdfund"
    wallet: WalletContextState
    
    constructor(wallet: WalletContextState) {
        super()
        this.wallet = wallet;
    }

    public createProject(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.wallet.connected) {
                reject("Wallet not connected");
                return;
            }
            try {
                const tx = new TransactionBlock();
                let [result] = tx.moveCall({
                    target: `${this.packageObjectId}::${this.moduleName}::create_project`,
                    arguments: [],
                });
                tx.transferObjects([result], this.wallet.address!!)
                const resData = this.wallet.signAndExecuteTransactionBlock({
                    transactionBlock: tx
                })
                

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }
    public addMilestone(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public fundProject(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public voteCompleteMilestone(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public redeemMilestone(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public voteFreeze(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public getRefund(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}