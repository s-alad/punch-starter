import Layout from "@/layout/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RedirectBasedOnAuth from "@/redirect/redirect";
import AuthProvider from "@/context/authcontext";
import { useConnect, Connect, StacksProvider } from "@stacks/connect-react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const ACCENT_COLOR = "#e03a44";

// Import RainbowKit
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Config RainbowKit
const config = getDefaultConfig({
  appName: "Punchstarter",
  projectId: "43a20e9b2e7ecab22145e7b0825a70e4",
  chains: [mainnet, polygon, optimism, arbitrum, base],
});

// Define your custom colors
const colors = {
  accent: ACCENT_COLOR,
};

// Extend the theme to set default text color to white
const theme = extendTheme({
  colors,
  styles: {
    global: {
      body: {
        color: "white",
        bg: "gray.800", // You can also set a background color if needed
      },
    },
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RedirectBasedOnAuth>
        <ChakraProvider theme={theme}>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={darkTheme({
                  accentColor: ACCENT_COLOR,
                  accentColorForeground: "white",
                })}
              >
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ChakraProvider>
      </RedirectBasedOnAuth>
    </AuthProvider>
  );
}
