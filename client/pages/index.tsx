import Head from "next/head";
import Image from "next/image";

import Top from "@/components/top/top";
import ConnectWallet, {
  DeployContract,
} from "@/sdk-connection-code/stacks-connection";
export default function Home() {
  return (
    <>
      <Head>
        <title>Lift</title>
        <meta name="description" content="lift" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Top />
        </div>
        <div>
          <h1>Rising Touchers!</h1>
          <ConnectWallet />
          <DeployContract />
        </div>
      </main>
    </>
  );
}
