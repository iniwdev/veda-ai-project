import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Env } from "../config/env.js";
import { redisSubscriber } from "../config/redis.js";

export type SocketServer = SocketIOServer;

export function createSocketServer(httpServer: HttpServer, env: Env): SocketServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.info(`Socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.info(`Socket disconnected: ${socket.id} — reason: ${reason}`);
    });
  });

  // Subscribe to Redis pub/sub for cross-process or worker communication
  redisSubscriber.subscribe("assignment-updates", (err) => {
    if (err) {
      console.error("Failed to subscribe to assignment-updates channel", err);
    }
  });

  redisSubscriber.on("message", (channel, message) => {
    if (channel === "assignment-updates") {
      try {
        const payload = JSON.parse(message);
        const { event, data } = payload;
        // Emit globally so all clients get the update
        io.emit(event, data);
      } catch (err) {
        console.error("Failed to process redis message", err);
      }
    }
  });

  return io;
}

export function publishAssignmentEvent(event: string, data: any): void {
  import("../config/redis.js")
    .then(({ redisConnection }) => {
      redisConnection.publish("assignment-updates", JSON.stringify({ event, data }));
    })
    .catch(console.error);
}
