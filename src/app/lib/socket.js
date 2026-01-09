// src/app/lib/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const url =
      process.env.NEXT_PUBLIC_CONTEST_SERVICE_URL || "http://localhost:8090";
    socket = io(url, {
      path: "/realtime",
      transports: ["websocket"],
      withCredentials: false,
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
