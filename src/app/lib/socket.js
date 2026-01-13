// src/app/lib/socket.js
import { io } from "socket.io-client";

let socket;

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export const getSocket = () => {
  if (!socket) {
    const isDev = process.env.NEXT_PUBLIC_MODE === "development";
    const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
    
    // Production: Always route through /submission/socket.io
    // Development: Direct to local port
    const url = isDev ? "http://localhost:8080" : `${base}/submission`;

    socket = io(url, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to realtime server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from realtime server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection remember:", err.message);
    });
  }

  return socket;
};

// ✅ Backend expects join:contest with payload object
export const joinContestRoom = (contestId) => {
  const s = getSocket();
  if (!contestId) return;
  s.emit("join:contest", { contestId });
  console.log(`📡 join:contest -> ${contestId}`);
};

export const joinUserRoom = (userId) => {
  const s = getSocket();
  if (!userId) return;
  s.emit("join:user", { userId });
  console.log(`🔐 join:user -> ${userId}`);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};
