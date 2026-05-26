import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ApiResponse } from "@repo/types";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      error: "Validation failed",
      message: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      timestamp: new Date().toISOString(),
    };
    res.status(400).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unhandled errors — never leak internals in production
  console.error("Unhandled error:", err);

  const response: ApiResponse = {
    success: false,
    error: process.env["NODE_ENV"] === "production" ? "Internal server error" : err.message,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
}

export function notFoundHandler(_req: Request, res: Response): void {
  const response: ApiResponse = {
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
}
