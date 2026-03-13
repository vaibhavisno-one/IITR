/**
 * AuthContext.js — Global authentication state provider
 * Provides: user, token, login(), logout()
 * Wrap the app with <AuthProvider> in _app.js
 */

import { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser, setToken, setUser, clearSession, setRefreshToken } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();
    if (savedToken && savedUser) {
      setTokenState(savedToken);
      setUserState(savedUser);
    }
    setLoading(false);
  }, []);

  /**
   * Call after a successful login/register API response.
   * @param {object} userData  - user object from backend
   * @param {string} accessToken
   * @param {string} [refreshToken]
   */
  function login(userData, accessToken, refreshToken) {
    setToken(accessToken);
    if (refreshToken) setRefreshToken(refreshToken);
    setUser(userData);
    setTokenState(accessToken);
    setUserState(userData);
  }

  function logout() {
    clearSession();
    setTokenState(null);
    setUserState(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
