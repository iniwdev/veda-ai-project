import type { Request, Response, NextFunction } from "express";
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

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
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
    error:
      process.env["NODE_ENV"] === "production"
        ? "Internal server error"
        : err.message,
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
