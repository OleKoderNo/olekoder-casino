import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { BalanceProvider } from "@/context/BalanceContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BalanceProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </BalanceProvider>
  );
}

export default MyApp;
