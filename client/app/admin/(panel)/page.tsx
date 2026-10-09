"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ago, api, type AdminProject, type Overview } from "@/lib/admin-api";
import { covers } from "@/lib/data";
import { Button, Card, PageHead, Status } from "@/components/admin/ui";

export default function Dashboard() {
  const router = useRouter();
  const [ov, setOv] = useState<Overview | null>(null);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api<Overview>("GET", "/api/admin/overview"), api<AdminProject[]>("GET", "/api/admin/projects")])
      .then(([o, p]) => { setOv(o); setProjects(p); })
      .catch((e) => setError(e.message));
  }, []);

  const kpis = ov && [
    { label: "Projects", v: String(ov.projects), sub: `${ov.published} published` },
    { label: "Featured", v: String(ov.featured), sub: "shown first on the homepage" },
    { label: "Unread messages", v: String(ov.unread), sub: "in your inbox" },
    { label: "Résumé", v: ov.resume ? "PDF" : "Default", sub: ov.resume ? "uploaded, linked on site" : "using the bundled copy" },
  ];

  return (
    <div className="flex max-w-[1200px] flex-col gap-7">
      <PageHead kicker="DASHBOARD" title="Hi, Atharv.">
        <Button variant="primary" onClick={() => router.push("/admin/projects/new")}>+ Add project</Button>
      </PageHead>
      {error && <Status kind="error">{error}</Status>}
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        {(kpis ?? [0, 1, 2, 3].map(() => null)).map((k, i) => (
          <Card key={i} className="flex flex-col gap-3.5 p-5">
            <span className="text-sm text-[#5A5375]">{k?.label ?? "Loading…"}</span>
            <span className="font-display text-[44px] font-extrabold leading-[0.9] tracking-[-0.03em]">{k?.v ?? "–"}</span>
            <span className="font-mono text-xs text-[#5A5375]">{k?.sub ?? " "}</span>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <Card className="p-5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-semibold">Latest messages</span>
            <Link href="/admin/messages" className="text-sm text-ultra">Open inbox →</Link>
          </div>
          {ov && ov.recent.length === 0 && <p className="m-0 border-t border-[#F0E7EC] py-4 text-sm text-[#5A5375]">No messages yet. They appear here when someone uses your contact form.</p>}
          {ov?.recent.slice(0, 4).map((m) => (
            <Link key={m.id} href={`/admin/messages?open=${m.id}`} className="flex items-center gap-3 border-t border-[#F0E7EC] px-1 py-3 text-navy">
              <span className="size-2 flex-none rounded-full" style={{ background: m.read ? "transparent" : "#3B4BFF" }} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={`truncate text-sm ${m.read ? "" : "font-semibold"}`}>{m.subject || "Enquiry"}</span>
                <span className="truncate text-[13px] text-[#5A5375]">{m.name} · {m.body}</span>
              </span>
              <span className="font-mono text-[11px] text-[#5A5375]">{ago(m.createdAt)}</span>
            </Link>
          ))}
        </Card>
        <Card className="p-5">
          <div className="mb-2.5 font-semibold">Featured on the homepage</div>
          {projects.filter((p) => p.featured && p.published).length === 0 && <p className="m-0 border-t border-[#F0E7EC] py-4 text-sm text-[#5A5375]">Nothing featured yet. Switch "Featured" on inside a project.</p>}
          {projects.filter((p) => p.featured && p.published).slice(0, 5).map((p) => (
            <Link key={p.id} href={`/admin/projects/${p.id}`} className="flex items-center gap-3 border-t border-[#F0E7EC] py-2.5 text-navy">
              <span className="h-[34px] w-11 flex-none rounded-lg bg-cover bg-center" style={p.coverUrl ? { backgroundImage: `url(${p.coverUrl.replace("/upload/", "/upload/c_fill,w_120,h_90,q_auto,f_auto/")})` } : { background: covers[p.cat] }} />
              <span className="flex-1 text-sm font-medium">{p.title}</span>
              <span className="font-mono text-[11px] text-[#5A5375]">{p.cat}</span>
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
}
