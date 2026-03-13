import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
