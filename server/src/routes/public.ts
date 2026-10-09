import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Message } from "../models/Message.js";
import { Project } from "../models/Project.js";
import { Resume } from "../models/Resume.js";
import { Settings } from "../models/Settings.js";
import { sendQuoteEmail } from "../lib/mail.js";

export const publicRouter = Router();

/** Tiny endpoint the contact page calls on load, so a sleeping free-tier server wakes up before the visitor hits Send. */
publicRouter.get("/ping", (_req, res) => res.json({ ok: true }));

/** Everything the public site needs in one call. */
publicRouter.get("/site", async (_req, res) => {
  const [settings, projects, resume] = await Promise.all([
    Settings.findOne({ key: "main" }),
    Project.find({ published: true }).sort({ order: 1, createdAt: -1 }),
    Resume.findOne().select("filename updatedAt size").lean(),
  ]);
  res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=300");
  res.json({
    settings: settings ? settings.toJSON() : null,
    projects: projects.map((p) => p.toJSON()),
    resume: resume ? { filename: resume.filename, updatedAt: resume.updatedAt } : null,
  });
});

publicRouter.get("/resume", async (_req, res) => {
  const r = await Resume.findOne();
  if (!r) return res.status(404).json({ error: "No résumé uploaded yet" });
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${r.filename.replace(/[^\w.\- ]/g, "_")}"`,
    "Cache-Control": "public, max-age=300",
  });
  res.send(r.data);
});

const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages from this connection. Please try again in an hour." },
});

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  needs: z.array(z.string().trim().max(60)).max(8).default([]),
  budget: z.string().trim().max(60).optional().default(""),
  timeline: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(5, "Please write a short message").max(3000),
  website: z.string().optional(), // honeypot: real people leave this empty
});

publicRouter.post("/contact", quoteLimiter, async (req, res) => {
  const data = quoteSchema.parse(req.body);
  if (data.website) return res.json({ ok: true }); // bots get a fake success and nothing is stored

  const msg = await Message.create({
    name: data.name,
    email: data.email,
    subject: data.needs.join(", "),
    needs: data.needs,
    budget: data.budget,
    timeline: data.timeline,
    body: data.message,
  });
  // The enquiry is already saved in the admin inbox; the email is a bonus.
  const emailed = await sendQuoteEmail({
    name: data.name, email: data.email, needs: data.needs,
    budget: data.budget, timeline: data.timeline, body: data.message,
  });
  res.status(201).json({ ok: true, id: msg.id, emailed });
});
