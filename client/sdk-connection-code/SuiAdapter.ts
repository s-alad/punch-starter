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
        return new Promise((resolve, reject) => {
            if (!this.wallet.connected) {
                reject("Wallet not connected");
                return;
            }
            try {
                const tx = new TransactionBlock();
                let [result] = tx.moveCall({
                    target: `${this.packageObjectId}::${this.moduleName}::add_milestone`,
                    arguments: [
                        tx.object("0xcdaac93855c5ff5198f80cee1412f5f1f2ea3c85f93c38f609ff1f3e6b3d6da7"),
                        tx.object("0xd8c77ca28cb870c5a85c8654f10cc29d987efc5b8b13116ffdb054946f28157a"),
                        tx.pure(12300000)
                    ],
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