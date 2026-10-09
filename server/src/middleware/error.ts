import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isProd } from "../env.js";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const notFound = (_req: Request, res: Response) => res.status(404).json({ error: "Not found" });

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Please check the highlighted fields",
      fields: Object.fromEntries(err.issues.map((i) => [i.path.join("."), i.message])),
    });
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  const e = err as { name?: string; code?: number; message?: string };
  if (e.name === "CastError") return res.status(400).json({ error: "Invalid id" });
  if (e.code === 11000) return res.status(409).json({ error: "That value already exists" });
  console.error(err);
  res.status(500).json({ error: isProd ? "Something went wrong" : e.message ?? "Server error" });
}
