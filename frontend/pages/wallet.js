import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import WalletCard from "@/components/wallet/WalletCard";
import PaymentHistory from "@/components/wallet/PaymentHistory";
import withAuth from "@/components/withAuth";

function WalletPage() {
  const { user } = useAuth();
  const { loading, error, transactions, walletBalance, lockedBalance, payoutBalance } = useWallet();

  const isEmployer = user?.role === "employer";

  // Use true backend payoutBalance for earnings
  const totalEarnings = payoutBalance || 0;
  
  const pendingPayments = transactions
    .filter((p) => (p.status === "pending" || p.status === "escrowed") && p.freelancer?._id === user?._id)
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const walletData = isEmployer 
    ? { balance: walletBalance, escrowLocked: lockedBalance }
    : { earnings: totalEarnings, pendingPayments: pendingPayments, withdrawn: 0 };

  return (
    <>
      <Head>
        <title>Wallet — GigChain</title>
        <meta name="description" content="Manage your wallet, escrow, and payment history on GigChain." />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="mt-2 text-muted">
            {isEmployer
              ? "Manage your funds, escrow, and project payments."
              : "Track your earnings, pending payouts, and payment history."}
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="animate-pulse rounded-2xl bg-surface h-48" />
            <div className="animate-pulse rounded-2xl bg-surface h-64" />
          </div>
        ) : (
          <div className="space-y-10">
            <WalletCard walletData={walletData} />

            <div>
              <h2 className="mb-5 text-xl font-semibold">Payment History</h2>
              <PaymentHistory payments={transactions} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default withAuth(WalletPage);
