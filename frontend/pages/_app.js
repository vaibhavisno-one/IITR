import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </WalletProvider>
    </AuthProvider>
  );
}
