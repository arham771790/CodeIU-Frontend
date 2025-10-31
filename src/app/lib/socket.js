// src/app/lib/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = (contestId) => {
  // Avoid multiple socket connections
  if (!socket) {
    socket = io("http://localhost:8060", {
      path: "/realtime",           // ✅ must match backend
      transports: ["websocket"],   // skip polling to avoid 404 spam
      withCredentials: false,
    });

    // --- Global connection lifecycle logs ---
    socket.on("connect", () => {
      console.log("✅ Connected to realtime server:", socket.id);
      if (contestId) {
        socket.emit("joinRoom", `contest:${contestId}`);
        console.log(`📡 Joined room contest:${contestId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from realtime server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // --- Leaderboard live updates ---
    socket.on("leaderboard:update", (data) => {
      console.log("🔥 Leaderboard update event received:", data);
      // You can dispatch a Zustand store update or re-fetch leaderboard here
      // Example: useLeaderboardStore.getState().fetchLeaderboard(data.contestId);
    });

    // --- Contest status changes ---
    socket.on("contestStatusUpdated", (payload) => {
      console.log("🚀 Contest status updated:", payload);
      // Example: useContestStore.getState().updateContestStatus(payload);
    });
  }

  // If a contestId is passed after socket already exists, ensure room join
  if (socket.connected && contestId) {
    socket.emit("joinRoom", `contest:${contestId}`);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};
