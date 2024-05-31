import { ConnectButton, WalletProvider, useWallet } from "@suiet/wallet-kit";
import { SuiAdapter } from "./SuiAdapter";

export const SomeRandomWalletConnect = () => {
  const wallet = useWallet();

  return (
    <WalletProvider>
    <div style={{margin: 10, padding: 10, border: '1px solid black', borderRadius: 10}}>
      <h4>Sui Wallet</h4>
      <header>
        <ConnectButton/>
      </header>
      <div>
        <button
          onClick={() => {
            new SuiAdapter(wallet).createProject().then(() => {
              alert("Project created");
            }).catch((err) => {
              alert("Error creating project: " + err);
            });
          }}
          >Create Project</button>
          <button
            onClick={() => {
              new SuiAdapter(wallet).addMilestone().then(() => {
                alert("Milestone added");
              }).catch((err) => {
                alert("Error adding milestone: " + err);
              });

            }}
          >Add Milestone</button>
      </div>
    </div>
    </WalletProvider>
  );
};
