import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </AuthProvider>
  );
}
