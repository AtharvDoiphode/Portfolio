import { Project } from "../models/Project.js";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "project";

/** Returns a slug that no other project uses (adds -2, -3 ... if needed). */
export async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  for (let n = 2; ; n++) {
    const hit = await Project.findOne({ slug }).select("_id").lean();
    if (!hit || String(hit._id) === ignoreId) return slug;
    slug = `${base}-${n}`;
  }
}
