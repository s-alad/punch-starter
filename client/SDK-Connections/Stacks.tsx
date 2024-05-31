import { AppConfig, UserSession, showConnect, openContractDeploy } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function authenticate() {
    showConnect({
      appDetails: {
        name: 'Punch Starter',
        icon: '',
      },
      redirectTo: '/',
      onFinish: () => {
        let userData = userSession.loadUserData();
      },
      userSession: userSession,
    });
}

function StacksConnect() {
    <button className="StacksConnect" onClick={authenticate}>
        Connect to Stacks Wallet
    </button>
}

export {StacksConnect};


async function deploy() {
    const response = fetch("../../contracts/clarity/contracts/Campaign.clar");
    const codeBody = await (await response).text();

    openContractDeploy({
            contractName: 'Campaign', //add uuid
            codeBody,
            appDetails: {
                name: 'Punch Starter',
                icon: '',
            },
            onFinish: data => {
                console.log('Stacks Transaction:', data.stacksTransaction);
                console.log('Transaction ID:', data.txId);
                console.log('Raw transaction:', data.txRaw);
            },
        });
}

function StacksDeploy() {
    return(
        <button className="deploy" onClick={deploy}>
            Activate Funding
        </button>
    );
}

export {StacksDeploy};

