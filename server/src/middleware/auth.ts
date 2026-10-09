import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env, isProd } from "../env.js";

export const COOKIE = "admin_token";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_MS,
};

export const signToken = () => jwt.sign({ role: "admin" }, env.JWT_SECRET, { expiresIn: "7d" });

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.status(401).json({ error: "Not signed in" });
  try {
    jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired" });
  }
}

/**
 * CSRF guard for cookie auth: every state-changing request must carry a custom header.
 * Browsers can't add custom headers on cross-site form posts, and CORS blocks it for fetch.
 */
export function requireCsrfHeader(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("x-requested-with") !== "portfolio-admin") return res.status(403).json({ error: "Bad request origin" });
  next();
}
