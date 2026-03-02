import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

const BASE_URL = "/api/v1";

// --- Refresh Token Queue ---
// When an access token expires while multiple requests are in-flight,
// we queue them and replay them all once a single refresh succeeds.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const addInterceptors = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // --- Handle 401 Unauthorized ---
      if (error.response?.status === 401 && !originalRequest._retry) {
        const { isCheckingAuth } = useAuthStore.getState();

        // Skip refresh during initial auth check on app load
        if (isCheckingAuth) {
          return Promise.reject(error);
        }

        // If we're already refreshing, queue this request instead of firing another refresh
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to get a new access token using the httpOnly refresh cookie
          await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

          // If refresh succeeded, replay all queued requests
          processQueue(null);

          // Replay the original failed request
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh token is also invalid/expired — full logout
          processQueue(refreshError);
          useAuthStore.setState({ authUser: null, isAuthenticated: false });
          toast.error("Session expired. Please sign in again.");

          // Redirect to login (client-side)
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // --- Handle 429 Rate Limit ---
      if (error.response?.status === 429) {
        toast.error("Too many requests. Please slow down.");
      }

      return Promise.reject(error);
    }
  );
  return instance;
};

/**
 * =========================
 * AUTH SERVICE
 * =========================
 */
export const axiosInstanceAuthService = addInterceptors(axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
}));

/**
 * =========================
 * PROBLEM SERVICE
 * =========================
 */
export const axiosInstanceProblemService = addInterceptors(axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
}));

/**
 * =========================
 * CONTEST SERVICE
 * =========================
 */
export const axiosInstanceContestService = addInterceptors(axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
}));

/**
 * =========================
 * SUBMISSION SERVICE
 * =========================
 */
export const axiosInstanceSubmissionService = addInterceptors(axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
}));
