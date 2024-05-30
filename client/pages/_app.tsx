import "@/styles/globals.css";

import { Connect, StacksProvider, useConnect } from "@stacks/connect-react";

import type { AppProps } from "next/app";
import AuthProvider from "@/context/authcontext";
import Layout from "@/layout/layout";
import RedirectBasedOnAuth from "@/redirect/redirect";
import { WalletProvider } from "@suiet/wallet-kit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WalletProvider>
        <RedirectBasedOnAuth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RedirectBasedOnAuth>
      </WalletProvider>
    </AuthProvider>
  );
}
