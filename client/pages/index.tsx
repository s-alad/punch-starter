import ConnectWallet, {
  DeployContract,
} from "@/sdk-connection-code/stacks-connection";

import { ConnectButton } from "@suiet/wallet-kit";
import Head from "next/head";
import Image from "next/image";
import {SuiWalletConnect} from "@/sdk-connection-code/sui-connection";
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
          <ConnectWallet />
          <DeployContract />
        </div>
      </main>
    </>
  );
}
