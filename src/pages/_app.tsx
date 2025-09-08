import "@/styles/globals.css";
import "@/styles/responsive.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <title>MyBNB</title>
        <meta name="description" content="A web application for booking property listings." />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
