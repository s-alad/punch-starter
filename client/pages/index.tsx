import ConnectWallet, {
  DeployContract,
} from "@/sdk-connection-code/stacks-connection";

import { ConnectButton } from "@suiet/wallet-kit";
import Head from "next/head";
import Image from "next/image";
import { SuiWalletConnect } from "@/sdk-connection-code/sui-connection";
import Top from "@/components/top/top";
import s from "./index.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Lift</title>
        <meta name="description" content="lift" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${s.main}`}>
        <div className={s.left}>
          <Top />
        </div>
        <div className={s.right}>
          <h1>Rising Touchers!</h1>
          <SuiWalletConnect />
          <div
            style={{
              margin: 10,
              padding: 10,
              border: "1px solid black",
              borderRadius: 10,
            }}
          >
            <h4>Stacks Wallet</h4>
            <ConnectWallet />
            <DeployContract />
          </div>
        </div>
      </main>
    </>
  );
}
