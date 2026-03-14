import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";

export default function WalletCard({ walletData }) {
  const { user } = useAuth();
  const { deposit } = useWallet();
  const isEmployer = user?.role === "employer";
  
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState("");
  const [depositing, setDepositing] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    
    setDepositing(true);
    try {
      await deposit(amount);
      setShowDeposit(false);
      setAmount("");
    } catch (err) {
      alert(err.message || "Failed to deposit.");
    } finally {
      setDepositing(false);
    }
  };

  if (!walletData) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted">Loading wallet data…</p>
      </div>
    );
  }

  if (isEmployer) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Employer Wallet</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Balance */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Balance</div>
            <div className="mt-2 text-3xl font-black text-foreground">
              ${(walletData.balance || 0).toLocaleString()}
            </div>
          </div>

          {/* Escrow Locked */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Escrow Locked</div>
            <div className="mt-2 text-3xl font-black text-warning">
              ${(walletData.escrowLocked || 0).toLocaleString()}
            </div>
          </div>

          {/* Available */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Available</div>
            <div className="mt-2 text-3xl font-black text-success">
              ${((walletData.balance || 0) - (walletData.escrowLocked || 0)).toLocaleString()}
            </div>
          </div>
        </div>

        {showDeposit ? (
          <form onSubmit={handleDeposit} className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to deposit"
              className="rounded-lg border border-border bg-background px-4 py-2 w-48 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={depositing}
              className="rounded-lg bg-success px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {depositing ? "Processing..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeposit(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setShowDeposit(true)}
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            Deposit Funds
          </button>
        )}
      </div>
    );
  }

  // Freelancer wallet
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Freelancer Wallet</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Earnings */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Total Earnings</div>
          <div className="mt-2 text-3xl font-black text-success">
            ${(walletData.earnings || 0).toLocaleString()}
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Pending Payments</div>
          <div className="mt-2 text-3xl font-black text-warning">
            ${(walletData.pendingPayments || 0).toLocaleString()}
          </div>
        </div>

        {/* Withdrawn */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Withdrawn</div>
          <div className="mt-2 text-3xl font-black text-foreground">
            ${(walletData.withdrawn || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
