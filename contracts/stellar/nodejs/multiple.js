const {
    Keypair,
    Contract,
    SorobanRpc,
    TransactionBuilder,
    Networks,
    BASE_FEE,
  } = require("@stellar/stellar-sdk");
  
  const sourceKeypair = Keypair.fromSecret("SDCDKKKYMIO5NODHXYWGNS337RLUFOQTNI7AIKYSQJSHRYUP5SCE634P");
  const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
  const contractAddress = "CCQRTXDGPWLFVGCMQH72EOZB5BRL3SOEDPRT7MDUIZY5D2D2ISGNMF44";
  const contract = new Contract(contractAddress);
  
  async function createTransaction(method, params = []) {
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
  
    let transactionBuilder = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(method, ...params))
      .setTimeout(30);
  
    let builtTransaction = transactionBuilder.build();
    let preparedTransaction = await server.prepareTransaction(builtTransaction);
    preparedTransaction.sign(sourceKeypair);
  
    console.log(`Signed prepared transaction XDR: ${preparedTransaction.toEnvelope().toXDR("base64")}`);
  
    try {
      let sendResponse = await server.sendTransaction(preparedTransaction);
      console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
  
      if (sendResponse.status === "PENDING") {
        let getResponse = await server.getTransaction(sendResponse.hash);
  
        while (getResponse.status === "NOT_FOUND") {
          console.log("Waiting for transaction confirmation...");
          getResponse = await server.getTransaction(sendResponse.hash);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
  
        console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
  
        if (getResponse.status === "SUCCESS") {
          if (!getResponse.resultMetaXdr) {
            throw "Empty resultMetaXDR in getTransaction response";
          }
          let transactionMeta = getResponse.resultMetaXdr;
          let returnValue = getResponse.returnValue;
          console.log(`Transaction result: ${returnValue.value()}`);
        } else {
          throw `Transaction failed: ${getResponse.resultXdr}`;
        }
      } else {
        throw sendResponse.errorResultXdr;
      }
    } catch (err) {
      console.log("Sending transaction failed");
      console.log(JSON.stringify(err));
    }
  }
  
  (async () => {
    // await createTransaction("get_project");
    // await createTransaction("add_fund", [100, "GCFVG5KCOXH2YQLH2JHIZ3NFEW3ZTZO6ONFM7D4MTZOZCUBYP2BQEDCZ"]);
    // await createTransaction("add_milestone", ["NewMilestone", 1000, "Description of milestone"]);
    await createTransaction("claim_milestone", [0]);
    await createTransaction("vote_freeze", ["GCFVG5KCOXH2YQLH2JHIZ3NFEW3ZTZO6ONFM7D4MTZOZCUBYP2BQEDCZ", 100]);
  })();
  