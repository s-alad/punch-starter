import Layout from "@/layout/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RedirectBasedOnAuth from "@/redirect/redirect";
import AuthProvider from "@/context/authcontext";
import { Inter as FontSans } from "next/font/google"
import { TooltipProvider } from "../components/ui/tooltip";
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RedirectBasedOnAuth>
        <Layout>
          <TooltipProvider>
          <Component className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )} {...pageProps} />
          </TooltipProvider>
        </Layout>
      </RedirectBasedOnAuth>
    </AuthProvider>
  )
}
