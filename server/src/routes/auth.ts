import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "../env.js";
import { COOKIE, cookieOptions, requireAdmin, requireCsrfHeader, signToken } from "../middleware/auth.js";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in 15 minutes." },
});

const loginSchema = z.object({ email: z.string().trim().max(200), password: z.string().min(1).max(200) });

authRouter.post("/login", loginLimiter, requireCsrfHeader, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  // Always run the hash compare so response time doesn't reveal whether the email matched.
  const passwordOk = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
  const emailOk = email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
  if (!emailOk || !passwordOk) return res.status(401).json({ error: "Wrong email or password" });
  res.cookie(COOKIE, signToken(), cookieOptions);
  res.json({ ok: true, email: env.ADMIN_EMAIL });
});

authRouter.post("/logout", requireCsrfHeader, (_req, res) => {
  res.clearCookie(COOKIE, { ...cookieOptions, maxAge: undefined });
  res.json({ ok: true });
});

authRouter.get("/me", requireAdmin, (_req, res) => res.json({ email: env.ADMIN_EMAIL }));
