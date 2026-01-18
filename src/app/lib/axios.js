import axios from "axios";

const BASE_URL = "/api/v1";

/**
 * =========================
 * AUTH SERVICE
 * =========================
 */
export const axiosInstanceAuthService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * =========================
 * PROBLEM SERVICE
 * =========================
 */
export const axiosInstanceProblemService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * =========================
 * CONTEST SERVICE
 * =========================
 */
export const axiosInstanceContestService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * =========================
 * SUBMISSION SERVICE
 * =========================
 */
export const axiosInstanceSubmissionService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
