const ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL;
const INTERNAL_API_URL = process.env.INTERNAL_GATEWAY_URL; // Only available on Node.js server
const isLocal = !ALB_URL || ALB_URL.includes("localhost");

const BASE = INTERNAL_API_URL || (isLocal ? "http://localhost:8000" : ALB_URL);

export const AUTH_SERVICE_URL = `${BASE}/auth`;
export const PROBLEM_SERVICE_URL = `${BASE}/problem`;
export const SUBMISSION_SERVICE_URL = `${BASE}/submission`;
export const CONTEST_SERVICE_URL = `${BASE}/contest`;
export const NOTIFICATION_SERVICE_URL = `${BASE}/notification`;
