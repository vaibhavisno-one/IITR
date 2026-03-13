/**
 * auth.js — Token & user session helpers
 * Stores accessToken and user info in localStorage.
 * All reads are guarded for SSR (typeof window check).
 */

// ─── Token ────────────────────────────────────────────────────────────────────

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
}

// ─── Refresh token (stored in memory or cookie — backend handles httpOnly) ───

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setRefreshToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("refreshToken", token);
}

export function clearRefreshToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("refreshToken");
}

// ─── User ──────────────────────────────────────────────────────────────────────

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isLoggedIn() {
  return Boolean(getToken());
}

export function clearSession() {
  clearToken();
  clearRefreshToken();
  clearUser();
}
