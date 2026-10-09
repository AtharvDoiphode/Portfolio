"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, type Overview } from "@/lib/admin-api";
import { chip } from "@/lib/data";

interface Ctx { email: string; counts: { projects: number; unread: number }; refresh: () => void }
const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("useAdmin outside AdminShell");
  return v;
};

const NAV = [
  { href: "/admin", label: "Dashboard", dot: chip(25), match: (p: string) => p === "/admin" },
  { href: "/admin/projects", label: "Projects", dot: chip(300), match: (p: string) => p.startsWith("/admin/projects") },
  { href: "/admin/settings", label: "Site settings", dot: chip(150), match: (p: string) => p.startsWith("/admin/settings") },
  { href: "/admin/messages", label: "Messages", dot: chip(85), match: (p: string) => p.startsWith("/admin/messages") },
  { href: "/admin/resume", label: "Resume", dot: chip(250), match: (p: string) => p.startsWith("/admin/resume") },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [counts, setCounts] = useState({ projects: 0, unread: 0 });

  const refresh = useCallback(() => {
    api<Overview>("GET", "/api/admin/overview").then((o) => setCounts({ projects: o.projects, unread: o.unread })).catch(() => {});
  }, []);

  useEffect(() => {
    api<{ email: string }>("GET", "/api/auth/me")
      .then((r) => { setEmail(r.email); refresh(); })
      .catch(() => router.replace("/admin/login"));
  }, [router, refresh]);

  async function logout() {
    await api("POST", "/api/auth/logout", {}).catch(() => {});
    router.replace("/admin/login");
  }

  if (!email) {
    return <div className="grid min-h-screen place-items-center font-mono text-sm text-[#5A5375]">Checking your session…</div>;
  }

  return (
    <AdminCtx.Provider value={{ email, counts, refresh }}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="flex flex-none flex-col gap-1 bg-navy p-3.5 text-paper md:sticky md:top-0 md:h-screen md:w-[248px] md:py-[22px]">
          <div className="flex items-center justify-between px-3 py-1.5 md:pb-[22px]">
            <span className="font-display text-[19px] font-extrabold tracking-[-0.03em]">
              Atharv Doiphode <span className="font-mono text-[11px] font-normal tracking-normal text-mute-d">admin</span>
            </span>
          </div>
          <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {NAV.map((n) => {
              const on = n.match(path);
              const badge = n.label === "Messages" && counts.unread ? String(counts.unread) : n.label === "Projects" ? String(counts.projects || "") : "";
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-h-11 flex-none items-center justify-between gap-2.5 rounded-xl px-3 text-[15px] whitespace-nowrap transition-colors hover:bg-white/10 ${on ? "bg-white/10 text-white" : "text-mist"}`}
                >
                  <span className="flex items-center gap-2.5"><span className="size-2 rounded-[2px]" style={{ background: n.dot }} />{n.label}</span>
                  {badge && <span className={`rounded-full px-[7px] py-0.5 font-mono text-[11px] ${n.label === "Messages" ? "bg-ultra" : ""}`}>{badge}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="flex gap-1 border-white/10 pt-3 md:mt-auto md:flex-col md:border-t">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center rounded-[10px] px-3 text-sm text-mist hover:bg-white/10 hover:text-white">View live site ↗</a>
            <button type="button" onClick={logout} className="min-h-10 rounded-[10px] border-0 bg-transparent px-3 text-left text-sm text-mist hover:bg-white/10 hover:text-white">Sign out</button>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-[clamp(20px,3vw,40px)]">{children}</main>
      </div>
    </AdminCtx.Provider>
  );
}
