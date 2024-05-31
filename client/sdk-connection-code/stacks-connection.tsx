import {
  AppConfig,
  UserSession,
  openContractDeploy,
  openContractCall,
  showConnect,
  SignatureData,
  SignatureRequestOptions,
} from "@stacks/connect";
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from "@stacks/network";
import React, { useEffect, useState } from "react";
import { useConnect, Connect, StacksProvider } from "@stacks/connect-react";
import axios from 'axios';

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

const mainnet = new StacksMainnet();
const testnet = new StacksTestnet();

function authenticate() {
  showConnect({
    appDetails: {
      name: "Punch Starter",
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

  const { sign } = useConnect();
  const signmessage = async () => {
    const options: SignatureRequestOptions = {
      message: "authentication",
      appDetails: {
        name: "Punch Starter",
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

interface DeployContractProps {
  fundingGoal: number;
  blockDuration: number;
  numberOfMilestones: number;
}



function DeployContract({fundingGoal, blockDuration, numberOfMilestones} : DeployContractProps) {
  const [ address, setAddress ] = useState("");
  const [ contractName, setContractName ] = useState("Campaign4");

  const functionArgs = [
    uintCV(fundingGoal),
    uintCV(blockDuration),
    uintCV(numberOfMilestones)
  ];

  const options = {
    contractAddress: address,
    contractName: contractName,
    functionName: 'start',
    functionArgs,
    appDetails: {
      name: 'Punch Starter',
      icon: ""
    },
    onFinish: () => {
      
    },
  }

  const handleDeployContract = async () => {
    const response = await fetch(
      "../../contracts/stacks/contracts/Campaign.clar"
    );
    const codeBody = await response.text();
    await openContractDeploy({
      contractName: contractName, //Add uuid for unique wallet
      codeBody,
      appDetails: {
        name: "Punch Starter",
        icon: "",
      },
      network: testnet,
      onFinish: (data) => {
          const url = `https://api.mainnet.hiro.so/extended/v1/tx/${data.txId}`;

          try {
              const response = axios.get(url);
              console.log(response);
          } catch (error) {
              console.error(error);
          }
          setAddress("SP194138VA57FKR364CBH0DZBCXT7RS4BJEQZ8SP3");
          openContractCall(options);
      },
    });
  };



  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "Punch Starter",
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


function donateStacks(amount: number) {
  const functionArgs = [
    uintCV(amount)
  ];

  const options = {
      contractAddress: address,
      contractName: contractName,
      functionName: 'donate',
      functionArgs,
      appDetails: {
        name: 'Punch Starter',
        icon: '',
      },
      onFinish: () => {

      }
  };

  openContractCall(options);
}

function claimRefundStacks() {

  const options = {
      contractAddress: address,
      contractName: contractName,
      functionName: 'claim-refund',
      appDetails: {
        name: 'Punch Starter',
        icon: '',
      },
      functionArgs: [],
      onFinish: () => {

      }
  };

  openContractCall(options);
}


function claimMilestoneStacks(index: number) {
    const functionArgs = [
      uintCV(index)
    ];

    const options = {
      contractAddress: address,
      contractName: contractName,
      functionName: 'claim-milestone',
      functionArgs,
      appDetails: {
        name: 'Punch Starter',
        icon: '',
      },
      onFinish: () => {

      }
    };

    openContractCall(options);
}

function submitMilestoneStacks(submissionsDetails: string, index: number){
  const functionArgs = [
    stringAsciiCV(submissionsDetails),
    uintCV(index)
  ];

  const options = {
    contractAddress: address,
    contractName: contractName,
    functionName: 'submit-milestone',
    functionArgs,
    appDetails: {
      name: 'Punch Starter',
      icon: '',
    },
    onFinish: () => {

    }
  };

  openContractCall(options);
}

function voteOnMilestone(index: number){
  const functionArgs = [
    uintCV(index)
  ];

  const options = {
    contractAddress: address,
    contractName: contractName,
    functionName: 'vote-on-milestone',
    functionArgs,
    appDetails: {
      name: 'Punch Starter',
      icon: '',
    },
    onFinish: () => {

    }
  };

  openContractCall(options);
}

function voteToFreeze() {
  // const options = {
  //   contractAddress: address,
  //   contractName: contractName,
  //   functionName: 'vote-to-freeze',
  //   appDetails: {
  //     name: 'Punch Starter',
  //     icon: '',
  //   },
  //   onFinish: () => {

  //   }
  // };

  // openContractCall(options);
}

