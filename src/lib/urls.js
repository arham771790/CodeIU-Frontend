const ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL;
const INTERNAL_API_URL = process.env.INTERNAL_GATEWAY_URL; // Only available on Node.js server
const isLocal = !ALB_URL || ALB_URL.includes("localhost");

const PROD_BASE = INTERNAL_API_URL || ALB_URL;

export const AUTH_SERVICE_URL = isLocal ? "http://localhost:8020" : `${PROD_BASE}/auth`;
export const PROBLEM_SERVICE_URL = isLocal ? "http://localhost:8000" : `${PROD_BASE}/problem`;
export const PROBLEM_API_URL = isLocal
  ? "http://localhost:8000/problem/api/v1"
  : `${PROD_BASE}/problem/api/v1`;
export const SUBMISSION_SERVICE_URL = isLocal ? "http://localhost:8080" : `${PROD_BASE}/submission`;
export const CONTEST_SERVICE_URL = isLocal ? "http://localhost:8090" : `${PROD_BASE}/contest`;
export const NOTIFICATION_SERVICE_URL = isLocal ? "http://localhost:8030" : `${PROD_BASE}/notification`;

// Full service-mounted API base URLs (include the mounted /api/v1 paths used by backend routers)
export const AUTH_API_URL = isLocal
  ? "http://localhost:8020/auth/api/v1"
  : `${PROD_BASE}/auth/api/v1`;
export const SUBMISSION_API_URL = isLocal
  ? "http://localhost:8080/submission/api/v1"
  : `${PROD_BASE}/submission/api/v1`;
export const CONTEST_API_URL = isLocal
  ? "http://localhost:8090/contest/api/v1"
  : `${PROD_BASE}/contest/api/v1`;
export const NOTIFICATION_API_URL = isLocal
  ? "http://localhost:8030/notification/api/v1"
  : `${PROD_BASE}/notification/api/v1`;
