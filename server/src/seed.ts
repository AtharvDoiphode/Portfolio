/**
 * Fills an empty database with the content that's currently on the live design,
 * so the site looks identical the moment the API is connected.
 *   npm run seed            -> only fills what's missing (safe to re-run)
 *   npm run seed -- --force -> overwrites site settings and replaces all projects
 */
import mongoose from "mongoose";
import { env } from "./env.js";
import { Project } from "./models/Project.js";
import { Settings } from "./models/Settings.js";
import { projects, settings } from "./seedData.js";

const force = process.argv.includes("--force");

const slugOf = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function main() {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  const existing = await Settings.findOne({ key: "main" });
  if (!existing || force) {
    await Settings.findOneAndUpdate({ key: "main" }, { $set: settings }, { upsert: true });
    console.log(existing ? "Site settings overwritten." : "Site settings created.");
  } else console.log("Site settings already exist - left alone (use --force to overwrite).");

  const count = await Project.countDocuments();
  if (count === 0 || force) {
    if (force) await Project.deleteMany({});
    await Project.insertMany(projects.map((p, i) => ({ ...p, slug: slugOf(p.title), order: i, published: true })));
    console.log(`${projects.length} projects created.`);
  } else console.log(`${count} projects already exist - left alone (use --force to replace).`);

  await mongoose.disconnect();
}

main().catch((e) => { console.error("Seed failed:", e.message); process.exit(1); });
