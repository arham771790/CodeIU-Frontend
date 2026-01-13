import axios from "axios";

/**
 * Environment check
 * NEXT_PUBLIC_MODE = "development" | "production"
 */
const isDev = process.env.NEXT_PUBLIC_MODE === "development";

/**
 * Helper to normalize the Base URL.
 * Ensures the URL begins with a protocol (http/https) to prevent relative pathing bugs in the browser.
 */
const normalizeBaseUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // If no protocol, default to https for security (standard for ALB/Production)
  return `https://${url}`;
};

const BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

/**
 * =========================
 * AUTH SERVICE
 * Path: /auth/api/v1/auth/*
 * =========================
 */
export const axiosInstanceAuthService = axios.create({
  baseURL: isDev
    ? "http://localhost:8020/api/v1/auth"
    : `${BASE_URL}/auth/api/v1/auth`,
  withCredentials: true,
});

/**
 * =========================
 * PROBLEM SERVICE
 * Path: /problem/api/v1/problem/*
 * =========================
 */
export const axiosInstanceProblemService = axios.create({
  baseURL: isDev
    ? "http://localhost:8000/api/v1/problem"
    : `${BASE_URL}/problem/api/v1/problem`,
  withCredentials: true,
});

/**
 * =========================
 * CONTEST SERVICE
 * Path: /contest/api/v1/contest/*
 * =========================
 */
export const axiosInstanceContestService = axios.create({
  baseURL: isDev
    ? "http://localhost:8090/api/v1/contest"
    : `${BASE_URL}/contest/api/v1/contest`,
  withCredentials: true,
});

/**
 * =========================
 * SUBMISSION SERVICE
 * Path: /submission/api/v1/*
 * =========================
 */
export const axiosInstanceSubmissionService = axios.create({
  baseURL: isDev
    ? "http://localhost:8080/api/v1"
    : `${BASE_URL}/submission/api/v1`,
  withCredentials: true,
});
