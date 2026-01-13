import axios from "axios";

const BASE_URL = "http://codeiu-314732537.ap-south-1.elb.amazonaws.com";

/**
 * =========================
 * AUTH SERVICE
 * =========================
 */
export const axiosInstanceAuthService = axios.create({
  baseURL: `${BASE_URL}/auth/api/v1`,
  withCredentials: true,
});

/**
 * =========================
 * PROBLEM SERVICE
 * =========================
 */
export const axiosInstanceProblemService = axios.create({
  baseURL: `${BASE_URL}/problem/api/v1`,
  withCredentials: true,
});

/**
 * =========================
 * CONTEST SERVICE
 * =========================
 */
export const axiosInstanceContestService = axios.create({
  baseURL: `${BASE_URL}/contest/api/v1`,
  withCredentials: true,
});

/**
 * =========================
 * SUBMISSION SERVICE
 * =========================
 */
export const axiosInstanceSubmissionService = axios.create({
  baseURL: `${BASE_URL}/submission/api/v1`,
  withCredentials: true,
});
