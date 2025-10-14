import axios from "axios";

console.log("env:", process.env.NEXT_PUBLIC_MODE);

export const axiosInstanceAuthService = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MODE === "development"
      ? "http://localhost:8020/api/v1"
      : "/api/v1",
  withCredentials: true,
});

export const axiosInstanceProblemService = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MODE === "development"
      ? "http://localhost:8000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

export const axiosInstanceSubmissionService = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MODE === "development"
      ? "http://localhost:8080/api/v1"
      : "/api/v1",
  withCredentials: true,
});
