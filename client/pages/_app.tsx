import Layout from "@/layout/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RedirectBasedOnAuth from "@/redirect/redirect";
import AuthProvider from "@/context/authcontext";
import WalletProvider from "@/context/walletcontext";
import { useConnect, Connect, StacksProvider } from "@stacks/connect-react";
import { WalletProvider as SuiWalletProvider} from "@suiet/wallet-kit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RedirectBasedOnAuth>
        <SuiWalletProvider>
        <WalletProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
        </SuiWalletProvider>
      </RedirectBasedOnAuth>
    </AuthProvider>
  )
}