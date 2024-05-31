import ConnectWallet, {
  DeployContract,
} from "@/sdk-connection-code/stacks-connection";

//import ChatUI from "@/components/Chat";
import Head from "next/head";
import Image from "next/image";
import Top from "@/components/top/top";
import Rising from "@/components/rising/rising";

export default function Home() {
  return (
    <>
      <Head>
        <title>Punchstarter</title>
        <meta name="description" content="lift" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main>
        <div>
          <Top />
        </div>
        <div className={s.right}>
          <Rising />
        </div>
      </main>
    </>
  );
}
