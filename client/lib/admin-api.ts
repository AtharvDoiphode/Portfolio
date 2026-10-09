/** Browser-side client for the admin API (proxied through this site, so the login cookie is first-party). */

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

const SIGN_IN_PATHS = ["/api/auth/login", "/api/auth/me", "/api/auth/logout"];

export async function api<T = any>(method: string, path: string, body?: unknown, extra?: { raw?: BodyInit; headers?: Record<string, string> }): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60_000); // a sleeping free-tier server needs up to ~50s
  try {
    const res = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: {
        "x-requested-with": "portfolio-admin",
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
        ...extra?.headers,
      },
      body: extra?.raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && !SIGN_IN_PATHS.includes(path)) {
      window.location.assign("/admin/login");
      throw new ApiError(401, "Session expired");
    }
    if (!res.ok) throw new ApiError(res.status, data.error || "Request failed", data.fields);
    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(0, "Couldn't reach the server. If it was idle, give it a minute to wake up and try again.");
  } finally {
    clearTimeout(timer);
  }
}

export interface AdminProject {
  id: string; title: string; slug: string; cat: "Websites" | "AI Videos" | "Excel" | "Research";
  desc: string; long: string; tags: string[];
  liveUrl: string; liveLabel: string; codeUrl: string; codeLabel: string;
  ph: string; coverUrl: string; videoUrl: string; featured: boolean; published: boolean; order: number;
}
export interface AdminMessage {
  id: string; name: string; email: string; subject: string; needs: string[]; budget: string; timeline: string;
  body: string; read: boolean; archived: boolean; createdAt: string;
}
export interface SettingsDoc {
  profile: { name: string; headline: string; location: string; email: string; photoUrl: string; introPhotoUrl: string; aboutPhotoUrl: string };
  services: { glyph: string; hue: number; title: string; short: string; desc: string }[];
  skills: { group: string; items: string[] }[];
  stats: { value: string; label: string }[];
  links: { g: string; hue: number; name: string; sub: string; href: string }[];
}
export interface Overview {
  projects: number; published: number; featured: number; unread: number;
  recent: AdminMessage[]; resume: { filename: string; size: number; updatedAt: string } | null;
}

export function ago(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 90) return "now";
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)}d`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
