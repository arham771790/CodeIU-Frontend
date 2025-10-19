import { io } from "socket.io-client";

let socket;
export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8090", {
      path: "/realtime",       // ✅ must match backend
      transports: ["websocket"],
      withCredentials: false,
    });
  }
  return socket;
};
