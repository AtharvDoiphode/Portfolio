import express, { Router } from "express";
import { z } from "zod";
import { cloudinaryConfigured, signUpload } from "../lib/cloudinary.js";
import { mailConfigured, sendReplyEmail } from "../lib/mail.js";
import { revalidateSite } from "../lib/revalidate.js";
import { uniqueSlug } from "../lib/slug.js";
import { requireAdmin, requireCsrfHeader } from "../middleware/auth.js";
import { HttpError } from "../middleware/error.js";
import { Message } from "../models/Message.js";
import { CATEGORIES, Project } from "../models/Project.js";
import { Resume } from "../models/Resume.js";
import { Settings } from "../models/Settings.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin, requireCsrfHeader);

/* ---------- Dashboard ---------- */
adminRouter.get("/overview", async (_req, res) => {
  const [projects, published, featured, unread, messages, resume] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ published: true }),
    Project.countDocuments({ published: true, featured: true }),
    Message.countDocuments({ read: false, archived: false }),
    Message.find({ archived: false }).sort({ createdAt: -1 }).limit(5),
    Resume.findOne().select("filename size updatedAt").lean(),
  ]);
  res.json({ projects, published, featured, unread, recent: messages.map((m) => m.toJSON()), resume });
});

/* ---------- Projects ---------- */
const url = z.string().trim().max(500).refine((v) => v === "" || /^(https?:\/\/|\/)/.test(v), "Must start with https:// or /");
const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  cat: z.enum(CATEGORIES),
  desc: z.string().trim().max(200).default(""),
  long: z.string().trim().max(2000).default(""),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
  liveUrl: url.default(""),
  liveLabel: z.string().trim().max(40).default(""),
  codeUrl: url.default(""),
  codeLabel: z.string().trim().max(40).default(""),
  ph: z.string().trim().max(80).default(""),
  coverUrl: url.default(""),
  videoUrl: url.default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

adminRouter.get("/projects", async (_req, res) => {
  const list = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(list.map((p) => p.toJSON()));
});

adminRouter.post("/projects", async (req, res) => {
  const data = projectSchema.parse(req.body);
  const last = await Project.findOne().sort({ order: -1 }).select("order").lean();
  const p = await Project.create({ ...data, slug: await uniqueSlug(data.title), order: (last?.order ?? -1) + 1 });
  void revalidateSite();
  res.status(201).json(p.toJSON());
});

// NOTE: must be declared before "/projects/:id" so "reorder" isn't treated as an id.
adminRouter.put("/projects/reorder", async (req, res) => {
  const { ids } = z.object({ ids: z.array(z.string().length(24)).max(200) }).parse(req.body);
  await Project.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: i } } } })));
  void revalidateSite();
  res.json({ ok: true });
});

adminRouter.put("/projects/:id", async (req, res) => {
  const data = projectSchema.parse(req.body);
  const current = await Project.findById(req.params.id);
  if (!current) throw new HttpError(404, "Project not found");
  Object.assign(current, data);
  if (current.isModified("title")) current.slug = await uniqueSlug(data.title, current.id);
  await current.save();
  void revalidateSite();
  res.json(current.toJSON());
});

adminRouter.patch("/projects/:id", async (req, res) => {
  const patch = z.object({ published: z.boolean().optional(), featured: z.boolean().optional() }).parse(req.body);
  const p = await Project.findByIdAndUpdate(req.params.id, patch, { new: true });
  if (!p) throw new HttpError(404, "Project not found");
  void revalidateSite();
  res.json(p.toJSON());
});

adminRouter.delete("/projects/:id", async (req, res) => {
  const p = await Project.findByIdAndDelete(req.params.id);
  if (!p) throw new HttpError(404, "Project not found");
  void revalidateSite();
  res.json({ ok: true });
});

/* ---------- Site settings (profile, services, skills, stats, links) ---------- */
const s = (max: number) => z.string().trim().max(max).default("");
const settingsSchema = z.object({
  profile: z.object({
    name: s(80), headline: s(160), location: s(80), email: s(200),
    photoUrl: url.default(""), introPhotoUrl: url.default(""), aboutPhotoUrl: url.default(""),
  }),
  services: z.array(z.object({ glyph: s(4), hue: z.number().min(0).max(360).default(25), title: s(80), short: s(80), desc: s(300) })).max(12),
  skills: z.array(z.object({ group: s(40), items: z.array(z.string().trim().min(1).max(40)).max(20) })).max(12),
  stats: z.array(z.object({ value: s(12), label: s(60) })).max(8),
  links: z.array(z.object({ g: s(4), hue: z.number().min(-1).max(360).default(250), name: s(60), sub: s(80), href: url.default("") })).max(12),
});

adminRouter.get("/settings", async (_req, res) => {
  const doc = await Settings.findOne({ key: "main" });
  res.json(doc ? doc.toJSON() : null);
});

adminRouter.put("/settings", async (req, res) => {
  const data = settingsSchema.parse(req.body);
  const doc = await Settings.findOneAndUpdate({ key: "main" }, { $set: data }, { new: true, upsert: true });
  void revalidateSite();
  res.json(doc.toJSON());
});

/* ---------- Inbox ---------- */
adminRouter.get("/messages", async (req, res) => {
  const archived = req.query.archived === "1";
  const list = await Message.find({ archived }).sort({ createdAt: -1 }).limit(200);
  res.json(list.map((m) => m.toJSON()));
});

adminRouter.patch("/messages/:id", async (req, res) => {
  const patch = z.object({ read: z.boolean().optional(), archived: z.boolean().optional() }).parse(req.body);
  const m = await Message.findByIdAndUpdate(req.params.id, patch, { new: true });
  if (!m) throw new HttpError(404, "Message not found");
  res.json(m.toJSON());
});

/** Lets the inbox say whether in-panel replies can be sent at all. */
adminRouter.get("/mail", (_req, res) => res.json({ configured: mailConfigured() }));

/** Emails a reply to the visitor and keeps a copy on the message. Nothing is saved if the email fails. */
adminRouter.post("/messages/:id/reply", async (req, res) => {
  const { body } = z.object({ body: z.string().trim().min(1, "Write a reply first").max(5000) }).parse(req.body);
  const m = await Message.findById(req.params.id);
  if (!m) throw new HttpError(404, "Message not found");
  const sent = await sendReplyEmail(m, body);
  if (!sent.ok) throw new HttpError(502, sent.error);
  m.replies.push({ body, sentAt: new Date() });
  m.read = true;
  await m.save();
  res.json(m.toJSON());
});

adminRouter.delete("/messages/:id", async (req, res) => {
  const m = await Message.findByIdAndDelete(req.params.id);
  if (!m) throw new HttpError(404, "Message not found");
  res.json({ ok: true });
});

/* ---------- Résumé (PDF stored in MongoDB; max 4 MB) ---------- */
adminRouter.put(
  "/resume",
  express.raw({ type: "application/pdf", limit: "4mb" }),
  async (req, res) => {
    const buf = req.body as Buffer;
    if (!Buffer.isBuffer(buf) || buf.length === 0) throw new HttpError(400, "Send a PDF file");
    if (buf.subarray(0, 4).toString() !== "%PDF") throw new HttpError(400, "That file is not a PDF");
    const filename = String(req.get("x-filename") || "resume.pdf").slice(0, 120);
    await Resume.deleteMany({});
    await Resume.create({ filename, size: buf.length, data: buf });
    void revalidateSite();
    res.json({ ok: true, filename, size: buf.length });
  },
);

adminRouter.delete("/resume", async (_req, res) => {
  await Resume.deleteMany({});
  void revalidateSite();
  res.json({ ok: true });
});

/* ---------- Image uploads (browser -> Cloudinary directly) ---------- */
adminRouter.post("/uploads/sign", (_req, res) => {
  if (!cloudinaryConfigured()) throw new HttpError(503, "Image uploads aren't set up yet (add the Cloudinary keys to .env)");
  res.json(signUpload("portfolio"));
});
