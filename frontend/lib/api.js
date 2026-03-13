/**
 * api.js — Centralized API layer for GigChain frontend
 * All fetch calls attach the Bearer token automatically.
 * Throws an Error with server message on non-OK responses.
 */

import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── Shared fetch helper ───────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  console.log(`[API] ${options.method || "GET"} ${API_BASE}${path}`, { hasToken: !!token });

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed (${res.status})`;
    console.error(`[API] ERROR ${res.status} on ${path}:`, message);
    throw new Error(message);
  }

  console.log(`[API] OK ${res.status} on ${path}`);
  return data;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────

export const registerUser = (body) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginUser = (body) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const logoutUser = () =>
  request("/auth/logout", { method: "POST" });

export const refreshAccessToken = (body) =>
  request("/auth/refresh-token", { method: "POST", body: JSON.stringify(body) });

// ─── USER ──────────────────────────────────────────────────────────────────────

export const getUserProfile = () => request("/users/profile");

export const updateUserProfile = (body) =>
  request("/users/profile", { method: "PUT", body: JSON.stringify(body) });

export const getUserProjects = () => request("/users/projects");

export const getUserPFI = () => request("/users/pfi");

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export const getProjects = () => request("/projects");

export const getProjectById = (id) => request(`/projects/${id}`);

export const createProject = (body) =>
  request("/projects", { method: "POST", body: JSON.stringify(body) });

export const updateProject = (id, body) =>
  request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: "DELETE" });

export const assignFreelancer = (id, body) =>
  request(`/projects/${id}/assign`, { method: "POST", body: JSON.stringify(body) });

// ─── MILESTONES ───────────────────────────────────────────────────────────────

export const createMilestone = (body) =>
  request("/milestones", { method: "POST", body: JSON.stringify(body) });

export const getProjectMilestones = (projectId) =>
  request(`/projects/${projectId}/milestones`);

export const updateMilestone = (id, body) =>
  request(`/milestones/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const completeMilestone = (id) =>
  request(`/milestones/${id}/complete`, { method: "PATCH" });

// ─── SUBMISSIONS ──────────────────────────────────────────────────────────────

export const createSubmission = (body) =>
  request("/submissions", { method: "POST", body: JSON.stringify(body) });

export const getSubmissionById = (id) => request(`/submissions/${id}`);

export const getMilestoneSubmissions = (milestoneId) =>
  request(`/projects/milestones/${milestoneId}/submissions`);

export const reviewSubmission = (id, body) =>
  request(`/submissions/${id}/review`, { method: "PUT", body: JSON.stringify(body) });

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────

export const createEscrow = (body) =>
  request("/payments/escrow", { method: "POST", body: JSON.stringify(body) });

export const releasePayment = (milestoneId) =>
  request(`/payments/release/${milestoneId}`, { method: "POST" });

export const refundPayment = (milestoneId) =>
  request(`/payments/refund/${milestoneId}`, { method: "POST" });

export const getPaymentHistory = () => request("/payments/history");

// ─── PFI ──────────────────────────────────────────────────────────────────────

export const getPFIScore = (userId) => request(`/pfi/${userId}`);

export const recalculatePFI = (userId) =>
  request(`/pfi/${userId}/recalculate`, { method: "POST" });

export const getPFIRanking = () => request("/pfi/ranking");
