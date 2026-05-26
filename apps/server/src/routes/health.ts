import { Router, type Router as ExpressRouter } from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { redisConnection } from "../config/redis.js";
import type { ApiResponse } from "@repo/types";

const router: ExpressRouter = Router();

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  version: string;
  services: {
    mongodb: "connected" | "disconnected";
    redis: "connected" | "disconnected";
  };
}

router.get("/health", (_req: Request, res: Response) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const redisStatus =
    redisConnection.status === "ready" ? "connected" : "disconnected";

  const allHealthy = mongoStatus === "connected" && redisStatus === "connected";

  const healthData: HealthStatus = {
    status: allHealthy ? "healthy" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env["npm_package_version"] ?? "0.0.1",
    services: {
      mongodb: mongoStatus,
      redis: redisStatus,
    },
  };

  const response: ApiResponse<HealthStatus> = {
    success: true,
    data: healthData,
    timestamp: healthData.timestamp,
  };

  res.status(allHealthy ? 200 : 207).json(response);
});

export default router;
