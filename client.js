import { io } from "socket.io-client";
const socket = io("http://localhost:3322", {
  withCredentials: true,
  extraHeaders: {
    "X-ws-authorization": "abcd"
  }
});