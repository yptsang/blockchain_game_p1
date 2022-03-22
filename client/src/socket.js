import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "./config"

export const socket = io(SOCKET_SERVER_URL);
