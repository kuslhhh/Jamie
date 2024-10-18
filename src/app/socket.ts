"use client";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
const userId = Cookies.get("SSID");
const search = new URLSearchParams(
  typeof window !== "undefined" ? window.location.search : ""
);
export const socket = io("https://vibe-node-js.onrender.com", {
  query: { userId, roomId: search.get("room") },
});
