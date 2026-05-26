import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { createSocketServer } from "./sockets/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.js";

// ─── App Bootstrap ─────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  const app = express();

  // ── Security & Parsing Middleware ─────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use(env.API_PREFIX, healthRouter);

  // 404 handler (must be after all routes)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  // ── HTTP + Socket.IO Server ───────────────────────────────────────────────
  const httpServer = http.createServer(app);
  createSocketServer(httpServer, env);

  // ── Connect Services ──────────────────────────────────────────────────────
  await Promise.all([connectDatabase(), connectRedis()]);

  httpServer.listen(env.PORT, () => {
    console.info(`🚀 Server running on http://localhost:${env.PORT.toString()}`);
    console.info(`📡 Health check: http://localhost:${env.PORT.toString()}${env.API_PREFIX}/health`);
    console.info(`🌍 Environment: ${env.NODE_ENV}`);
  });

  // ── Graceful Shutdown ─────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    console.info(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      console.info("HTTP server closed");
    });
    await Promise.all([disconnectDatabase(), disconnectRedis()]);
    process.exit(0);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  process.on("unhandledRejection", (reason: unknown) => {
    console.error("Unhandled Promise Rejection:", reason);
    void shutdown("UNHANDLED_REJECTION");
  });
}

bootstrap().catch((err: unknown) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
