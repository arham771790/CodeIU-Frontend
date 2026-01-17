// src/app/lib/socket.js
import { io } from "socket.io-client";

const BASE_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";

let submissionSocket;
let contestSocket;

// ✅ Submission Service Socket
export const getSocket = () => {
  if (!submissionSocket) {
    // Connect to BASE_URL, path includes service prefix for ALB routing
    submissionSocket = io(BASE_URL, {
      path: "/submission/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    submissionSocket.on("connect", () => {
      console.log("✅ Connected to Submission Service:", submissionSocket.id);
    });

    submissionSocket.on("connect_error", (err) => {
      console.error("❌ Submission Socket error:", err.message);
    });
  }
  return submissionSocket;
};

// ✅ Contest Service Socket (Realtime)
export const getContestSocket = () => {
  if (!contestSocket) {
    // Connect to BASE_URL, path includes service prefix for ALB routing
    contestSocket = io(BASE_URL, {
      path: "/contest/realtime",
      transports: ["websocket"],
      withCredentials: true,
    });

    contestSocket.on("connect", () => {
      console.log("✅ Connected to Contest Service (Realtime):", contestSocket.id);
    });

    contestSocket.on("connect_error", (err) => {
      console.error("❌ Contest Socket error:", err.message);
    });
  }
  return contestSocket;
};

// ✅ Helpers for Contest Service
export const joinContestRoom = (contestId) => {
  const s = getContestSocket();
  if (!contestId) return;
  s.emit("join:contest", { contestId });
  console.log(`📡 join:contest -> ${contestId}`);
};

export const joinUserRoom = (userId) => {
  const s = getContestSocket();
  if (!userId) return;
  s.emit("join:user", { userId });
  console.log(`🔐 join:user -> ${userId}`);
};

// Submission specific join
export const joinSubmissionRoom = (userId) => {
  const s = getSocket();
  if (!userId) return;
  s.emit("join-room", userId);
  console.log(`📑 join-room (Submission) -> ${userId}`);
}

export const disconnectSocket = () => {
  if (submissionSocket) {
    submissionSocket.disconnect();
    submissionSocket = null;
  }
  if (contestSocket) {
    contestSocket.disconnect();
    contestSocket = null;
  }
  console.log("🔌 All sockets disconnected manually");
};
