import axios from "axios";

/**
 * Environment check
 * NEXT_PUBLIC_MODE = "development" | "production"
 */
const isDev = process.env.NEXT_PUBLIC_MODE === "development";

/**
 * Production base URL (ALB / Domain)
 * Example: https://api.codeiu.com
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * =========================
 * AUTH SERVICE
 * ALB path: /auth/*
 * =========================
 */
export const axiosInstanceAuthService = axios.create({
  baseURL: isDev
    ? "http://localhost:8020/api/v1"
    : `${API_BASE_URL}/auth/api/v1`,
  withCredentials: true,
});

/**
 * =========================
 * PROBLEM SERVICE
 * ALB path: /problems/*
 * =========================
 */
export const axiosInstanceProblemService = axios.create({
  baseURL: isDev
    ? "http://localhost:8000/api/v1"
    : `${API_BASE_URL}/problem/api/v1`,
  withCredentials: true,
});

/**
 * =========================
 * CONTEST SERVICE
 * ALB path: /contests/*
 * =========================
 */
export const axiosInstanceContestService = axios.create({
  baseURL: isDev
    ? "http://localhost:8090/api/v1"
    : `${API_BASE_URL}/contest/api/v1`,
  withCredentials: true,
});

/**
 * =========================
 * SUBMISSION SERVICE
 * ALB path: /submissions/*
 * =========================
 */
export const axiosInstanceSubmissionService = axios.create({
  baseURL: isDev
    ? "http://localhost:8080/api/v1"
    : `${API_BASE_URL}/submission/api/v1`,
  withCredentials: true,
});
