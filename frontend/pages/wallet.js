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

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Wallet</h1>
          <p className="mt-3 text-lg text-muted">
            {isEmployer
              ? "Manage your funds, escrow, and project payments."
              : "Track your earnings, pending payouts, and payment history."}
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-[15px] font-medium text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="animate-pulse rounded-2xl bg-surface h-48" />
            <div className="animate-pulse rounded-2xl bg-surface h-64" />
          </div>
        ) : (
          <div className="space-y-12">
            <WalletCard walletData={walletData} />

            <div>
              <h2 className="mb-6 text-2xl font-semibold">Payment History</h2>
              <PaymentHistory payments={transactions} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default withAuth(WalletPage);
