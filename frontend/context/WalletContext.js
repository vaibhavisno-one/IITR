import { createContext, useContext, useState, useEffect } from "react";
import { getWalletBalance, depositFunds, getEscrowSummary, getPaymentHistory } from "@/lib/api";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { user } = useAuth();
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [lockedBalance, setLockedBalance] = useState(0);
  const [payoutBalance, setPayoutBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallet = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [walletRes, escrowRes, historyRes] = await Promise.allSettled([
        getWalletBalance(),
        user.role === "employer" ? getEscrowSummary() : Promise.resolve({ data: { lockedAmount: 0 } }),
        getPaymentHistory()
      ]);

      if (walletRes.status === "fulfilled") {
        const wData = walletRes.value?.data || walletRes.value || {};
        setWalletBalance(wData.walletBalance ?? 0);
        setPayoutBalance(wData.payoutBalance ?? 0);
        // Optional fallback locking to ensure UI sync
        if (user.role === "freelancer") {
          setLockedBalance(0);
        }
      }
      
      if (escrowRes.status === "fulfilled") {
        setLockedBalance(escrowRes.value?.data?.lockedAmount ?? escrowRes.value?.lockedAmount ?? 0);
      }
      
      if (historyRes.status === "fulfilled") {
        const historyData = historyRes.value?.data || historyRes.value || [];
        setTransactions(Array.isArray(historyData) ? historyData : []);
      }
      
      setError(null);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
      setError("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  const deposit = async (amount) => {
    try {
      const res = await depositFunds({ amount: Number(amount) });
      const newBalance = res?.data?.balance || res?.balance || 0;
      setWalletBalance(newBalance);
      await fetchWallet(); // Refresh full state
      return res;
    } catch (err) {
      throw err;
    }
  };

  const refreshWallet = () => fetchWallet();

  const value = {
    walletBalance,
    lockedBalance,
    payoutBalance,
    transactions,
    loading,
    error,
    deposit,
    refreshWallet,
    fetchWallet
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
