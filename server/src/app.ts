import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { env } from "./env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter } from "./routes/public.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1); // Render sits behind a proxy; needed for correct client IPs in rate limiting
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: [env.FRONTEND_URL], credentials: true }));
  app.use(cookieParser());
  // JSON bodies are small; the résumé route uses its own raw parser (declared on the route).
  app.use((req, res, next) => (req.is("application/pdf") ? next() : express.json({ limit: "100kb" })(req, res, next)));

  app.get("/health", (_req, res) =>
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }),
  );

  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api", publicRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
