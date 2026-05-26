import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Env } from "../config/env.js";

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

    // ── Subscribe to job updates ────────────────────────────────────────────
    socket.on("subscribe:job", (jobId: string) => {
      void socket.join(`job:${jobId}`);
      console.info(`Socket ${socket.id} subscribed to job:${jobId}`);
    });

    socket.on("unsubscribe:job", (jobId: string) => {
      void socket.leave(`job:${jobId}`);
    });

    socket.on("disconnect", (reason) => {
      console.info(`Socket disconnected: ${socket.id} — reason: ${reason}`);
    });
  });

  return io;
}

// Helper to emit job progress updates from workers
export function emitJobProgress(
  io: SocketServer,
  jobId: string,
  progress: number,
  status: string,
): void {
  io.to(`job:${jobId}`).emit("job:progress", { jobId, progress, status });
}
