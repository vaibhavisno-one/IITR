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
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-[15px] font-medium text-muted">Loading wallet data…</p>
      </div>
    );
  }

  if (isEmployer) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Employer Wallet</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Balance */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-muted">Balance</div>
            <div className="mt-2 text-4xl font-black text-foreground tracking-tight">
              ${(walletData.balance || 0).toLocaleString()}
            </div>
          </div>

          {/* Escrow Locked */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-muted">Escrow Locked</div>
            <div className="mt-2 text-4xl font-black text-warning tracking-tight">
              ${(walletData.escrowLocked || 0).toLocaleString()}
            </div>
          </div>

          {/* Available */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-muted">Available</div>
            <div className="mt-2 text-4xl font-black text-success tracking-tight">
              ${((walletData.balance || 0) - (walletData.escrowLocked || 0)).toLocaleString()}
            </div>
          </div>
        </div>

        {showDeposit ? (
          <form onSubmit={handleDeposit} className="mt-8 flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to deposit"
              className="rounded-[10px] border border-border bg-background px-4 py-2.5 w-64 text-[15px] font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={depositing}
              className="rounded-[10px] bg-success px-[18px] py-[10px] text-[15px] font-semibold text-white transition-all hover:bg-[#1DAE50] disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
            >
              {depositing ? "Processing..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeposit(false)}
              className="rounded-[10px] px-4 py-[10px] text-[15px] font-semibold text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setShowDeposit(true)}
            className="mt-8 rounded-[10px] bg-primary px-[18px] py-[10px] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(79,110,247,0.3)]"
          >
            Deposit Funds
          </button>
        )}
      </div>
    );
  }

  // Freelancer wallet
  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Freelancer Wallet</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Earnings */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="text-[13px] font-semibold uppercase tracking-wider text-muted">Total Earnings</div>
          <div className="mt-2 text-4xl font-black text-success tracking-tight">
            ${(walletData.earnings || 0).toLocaleString()}
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="text-[13px] font-semibold uppercase tracking-wider text-muted">Pending Payments</div>
          <div className="mt-2 text-4xl font-black text-warning tracking-tight">
            ${(walletData.pendingPayments || 0).toLocaleString()}
          </div>
        </div>

        {/* Withdrawn */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="text-[13px] font-semibold uppercase tracking-wider text-muted">Withdrawn</div>
          <div className="mt-2 text-4xl font-black text-foreground tracking-tight">
            ${(walletData.withdrawn || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
