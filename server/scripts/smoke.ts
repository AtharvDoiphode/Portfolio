/**
 * End-to-end check of a RUNNING API (local or deployed).
 *   npm run dev            (in one terminal)
 *   npm run smoke          (in another)  -> asks for your admin password
 *   API_URL=https://your-api.onrender.com npm run smoke
 * It creates a temporary project and message, then deletes them.
 */
import "dotenv/config";

const API = (process.env.API_URL || "http://localhost:4000").replace(/\/$/, "");
const EMAIL = process.env.ADMIN_EMAIL || "";
let cookie = "";
let failed = 0;

const ok = (name: string, pass: boolean, extra = "") => {
  console.log(`${pass ? "  PASS" : "  FAIL"}  ${name}${extra ? "  - " + extra : ""}`);
  if (!pass) failed++;
};

async function call(method: string, path: string, body?: unknown, extra: Record<string, string> = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { "content-type": "application/json", "x-requested-with": "portfolio-admin", ...(cookie ? { cookie } : {}), ...extra },
    body: body ? JSON.stringify(body) : undefined,
  });
  const set = res.headers.get("set-cookie");
  if (set) cookie = set.split(";")[0];
  let json: any = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

function askHidden(q: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(q);
    const s = process.stdin;
    s.setRawMode?.(true); s.resume(); s.setEncoding("utf8");
    let v = "";
    const on = (ch: string) => {
      for (const c of ch) {
        if (c === "\r" || c === "\n") { s.setRawMode?.(false); s.pause(); s.off("data", on); process.stdout.write("\n"); return resolve(v); }
        if (c === "\u0003") process.exit(1);
        if (c === "\u007f" || c === "\b") v = v.slice(0, -1); else v += c;
      }
    };
    s.on("data", on);
  });
}

console.log(`Testing ${API}\n`);
const password = process.env.SMOKE_PASSWORD || (await askHidden("Admin password: "));

let r = await call("GET", "/health");
ok("health endpoint", r.status === 200 && r.json?.db === "connected", `db: ${r.json?.db}`);

r = await call("GET", "/api/admin/projects");
ok("admin routes reject anonymous visitors", r.status === 401);

r = await call("POST", "/api/auth/login", { email: EMAIL, password: "definitely-wrong-password" });
ok("wrong password is rejected", r.status === 401);

r = await call("POST", "/api/auth/login", { email: EMAIL, password });
ok("login with your password", r.status === 200, r.json?.error);
if (r.status !== 200) { console.log("\nCan't continue without login."); process.exit(1); }

r = await call("GET", "/api/auth/me");
ok("session cookie works", r.status === 200);

r = await call("POST", "/api/admin/projects", { title: "Smoke test project", cat: "Websites", desc: "temp", published: true });
ok("create project", r.status === 201, r.json?.error);
const id = r.json?.id;

r = await call("GET", "/api/site");
ok("published project appears on public API", Boolean(r.json?.projects?.some((p: any) => p.id === id)));

r = await call("PUT", `/api/admin/projects/${id}`, { title: "Smoke test project", cat: "Websites", desc: "edited", published: false });
ok("edit + unpublish project", r.status === 200 && r.json?.published === false);

r = await call("GET", "/api/site");
ok("unpublished project is hidden", !r.json?.projects?.some((p: any) => p.id === id));

r = await call("DELETE", `/api/admin/projects/${id}`);
ok("delete project", r.status === 200);

r = await call("POST", "/api/contact", { name: "Smoke Test", email: "smoke@example.com", needs: ["Website"], message: "Automated smoke test message" });
ok("contact form saves a message", r.status === 201, r.json?.emailed ? "email sent" : "email NOT sent (Resend not configured yet - fine until Day 4)");
if (r.json?.id) {
  r = await call("DELETE", `/api/admin/messages/${r.json.id}`);
  ok("delete test message", r.status === 200);
}

r = await call("POST", "/api/admin/uploads/sign");
ok("Cloudinary upload signing", r.status === 200 || r.status === 503, r.status === 503 ? "not configured yet (Step for images)" : "configured");

r = await call("POST", "/api/auth/logout");
r = await call("GET", "/api/admin/projects");
ok("logout ends the session", r.status === 401);

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
