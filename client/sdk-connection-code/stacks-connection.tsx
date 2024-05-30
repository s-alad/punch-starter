import {
  AppConfig,
  UserSession,
  openContractDeploy,
  showConnect,
  SignatureData,
  SignatureRequestOptions,
} from "@stacks/connect";
import { StacksTestnet, StacksMainnet } from "@stacks/network";
import React, { useEffect, useState } from "react";
import { useConnect, Connect, StacksProvider } from "@stacks/connect-react";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

const mainnet = new StacksMainnet();
const testnet = new StacksTestnet();

function authenticate() {
  showConnect({
    appDetails: {
      name: "rheo",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // const { sign } = useConnect();
  const signmessage = async () => {
    const options: SignatureRequestOptions = {
      message: "authentication",
      appDetails: {
        name: "rheo",
        icon: window.location.origin + "/logo512.png",
      },
      onFinish(data: SignatureData) {
        console.log("Signature of the message", data.signature);
        console.log("User public key:", data.publicKey);
      },
    };
    await sign(options);
  };

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <div className="Container">
        <button className="Connect" onClick={disconnect}>
          Disconnect Wallet
        </button>
        <button className="sign" onClick={signmessage}>
          sign message
        </button>
        <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p>
      </div>
    );
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Wallet
    </button>
  );
}

export default ConnectWallet;

function DeployContract() {
  const handleDeployContract = async () => {
    const response = await fetch(
      "../../contracts/stacks/contracts/Campaign.clar"
    );
    const codeBody = await response.text();
    await openContractDeploy({
      contractName: "Campaign", //Add uuid for unique wallet
      codeBody,
      appDetails: {
        name: "Uplift",
        icon: "",
      },
      network: testnet,
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    });
  };

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "rheo",
          icon: window.location.origin + "/logo512.png",
        },
        userSession,
      }}
    >
      <button className="Deploy" onClick={handleDeployContract}>
        Activate Funding
      </button>
    </Connect>
  );
}

export { DeployContract };
