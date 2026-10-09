import "server-only";
import {
  SITE, chip, projects as staticProjects, services as staticServices, skills as staticSkills,
  stats as staticStats, findMe as staticLinks, defaultPhotos, withDefaultCover, type Project, type Category,
} from "./data";

/** Everything the public pages need. Comes from the API; falls back to lib/data.ts if the API is down or empty. */
export interface SiteData {
  profile: { name: string; headline: string; location: string; email: string; photoUrl: string; introPhotoUrl: string; aboutPhotoUrl: string };
  services: { n: string; glyph: string; chip: string; title: string; short: string; desc: string }[];
  skills: { group: string; items: string[] }[];
  stats: { to: number; decimals: number; suffix: string; label: string }[];
  links: { g: string; c: string; name: string; sub: string; href: string }[];
  projects: Project[];
  resumeHref: string;
}

const API = process.env.API_URL?.replace(/\/$/, "");
const NEUTRAL = "#F7F3F5";
const hueColor = (h: number) => (h < 0 ? NEUTRAL : chip(h));

function parseStat(value: string, label: string) {
  const m = /^\s*(\d+(?:\.\d+)?)\s*(.*)$/.exec(value);
  if (!m) return { to: 0, decimals: 0, suffix: value, label };
  return { to: parseFloat(m[1]), decimals: (m[1].split(".")[1] ?? "").length, suffix: m[2], label };
}

export function fallbackSite(): SiteData {
  return {
    profile: { name: SITE.name, headline: "Full-stack developer, UI/UX designer and AI video creator", location: SITE.location, email: SITE.email, ...defaultPhotos },
    services: staticServices,
    skills: staticSkills,
    stats: staticStats,
    links: staticLinks,
    projects: staticProjects.map(withDefaultCover),
    resumeHref: SITE.resume,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function fromApi(json: any): SiteData | null {
  const s = json?.settings;
  if (!s) return null; // database not seeded yet
  const base = fallbackSite();
  const projects: Project[] = (json.projects ?? []).map((p: any) => {
    const links = [] as Project["links"];
    if (p.liveUrl) links.push({ label: p.liveLabel || (/^https?:/.test(p.liveUrl) ? "Visit site" : "Learn more"), href: p.liveUrl });
    if (p.codeUrl) links.push({ label: p.codeLabel || "View code", href: p.codeUrl });
    return withDefaultCover({
      id: p.id, cat: p.cat as Category, title: p.title, desc: p.desc ?? "", tags: p.tags ?? [], ph: p.ph ?? "",
      long: p.long || p.desc || "", links, coverUrl: p.coverUrl || undefined, videoUrl: p.videoUrl || undefined, featured: !!p.featured,
    });
  });
  // Featured projects lead their category (sort is stable, so the admin's order is kept inside each group).
  projects.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return {
    profile: { ...base.profile, ...Object.fromEntries(Object.entries(s.profile ?? {}).filter(([, v]) => v !== "")) } as SiteData["profile"],
    services: (s.services ?? []).map((x: any, i: number) => ({
      n: String(i + 1).padStart(2, "0"), glyph: x.glyph || "•", chip: hueColor(x.hue ?? 25), title: x.title, short: x.short || x.title, desc: x.desc ?? "",
    })),
    skills: (s.skills ?? []).map((g: any) => ({ group: String(g.group ?? ""), items: g.items ?? [] })),
    stats: (s.stats ?? []).map((x: any) => parseStat(String(x.value ?? ""), x.label ?? "")),
    links: (s.links ?? []).map((l: any) => ({ g: l.g || "↗", c: hueColor(l.hue ?? 250), name: l.name, sub: l.sub ?? "", href: l.href })),
    projects,
    resumeHref: SITE.resume,
  };
}

export async function getSite(): Promise<SiteData> {
  if (!API) return fallbackSite();
  try {
    const res = await fetch(`${API}/api/site`, { next: { revalidate: 60, tags: ["site"] }, signal: AbortSignal.timeout(9000) });
    if (!res.ok) return fallbackSite();
    return fromApi(await res.json()) ?? fallbackSite();
  } catch {
    return fallbackSite(); // API asleep or unreachable: the site still renders.
  }
}

export const socialFrom = (links: SiteData["links"]) => {
  const gh = links.find((l) => l.g === "GH");
  const li = links.find((l) => l.g === "in");
  const ig = links.find((l) => l.g === "IG");
  return [
    gh && { g: "GH", label: "GitHub", name: "GitHub", href: gh.href },
    li && { g: "in", label: "LinkedIn", name: "LinkedIn", href: li.href },
    ig && { g: "IG", label: `Instagram (${ig.name})`, name: "Instagram", href: ig.href },
  ].filter(Boolean) as { g: string; label: string; name: string; href: string }[];
};
