"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, type AdminProject } from "@/lib/admin-api";
import { covers } from "@/lib/data";
import { Button, Card, PageHead, Status, inputCls } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/AdminShell";

export default function ProjectsPage() {
  const router = useRouter();
  const { refresh } = useAdmin();
  const [list, setList] = useState<AdminProject[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<AdminProject[]>("GET", "/api/admin/projects").then(setList).catch((e) => setError(e.message));
  }, []);

  const filtering = q.trim() !== "";
  const rows = (list ?? []).filter((p) => !filtering || `${p.title} ${p.cat}`.toLowerCase().includes(q.toLowerCase()));

  async function move(i: number, d: -1 | 1) {
    if (!list) return;
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    try {
      await api("PUT", "/api/admin/projects/reorder", { ids: next.map((p) => p.id) });
    } catch (e) {
      setError((e as Error).message);
      setList(list);
    }
  }

  async function togglePublished(p: AdminProject) {
    try {
      const u = await api<AdminProject>("PATCH", `/api/admin/projects/${p.id}`, { published: !p.published });
      setList((cur) => cur?.map((x) => (x.id === p.id ? u : x)) ?? null);
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex max-w-[1200px] flex-col gap-5">
      <PageHead kicker={`PROJECTS · ${list?.length ?? 0}`} title="Projects">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" aria-label="Search projects" className={`${inputCls} !w-60 !max-w-full !rounded-full !text-sm`} />
        <Button variant="primary" onClick={() => router.push("/admin/projects/new")}>+ Add project</Button>
      </PageHead>
      {error && <Status kind="error">{error}</Status>}
      <Card className="overflow-auto">
        <div className="min-w-[760px]">
          <div className="grid gap-3 border-b border-[#F0E7EC] px-[18px] py-3 font-mono text-[11px] text-[#5A5375] [grid-template-columns:80px_2.2fr_1fr_1fr_1fr_80px]">
            <span>ORDER</span><span>TITLE</span><span>CATEGORY</span><span>STATUS</span><span>FEATURED</span><span />
          </div>
          {list === null && !error && <div className="px-[18px] py-8 text-sm text-[#5A5375]">Loading…</div>}
          {list?.length === 0 && <div className="px-[18px] py-8 text-sm text-[#5A5375]">No projects yet. Add your first one.</div>}
          {rows.map((p) => {
            const i = list!.indexOf(p);
            return (
              <div key={p.id} className="grid items-center gap-3 border-b border-[#F5EEF2] px-[18px] py-3 text-sm [grid-template-columns:80px_2.2fr_1fr_1fr_1fr_80px] hover:bg-[#FBF7F9]">
                <span className="flex items-center gap-1">
                  <button type="button" aria-label={`Move ${p.title} up`} disabled={filtering || i === 0} onClick={() => move(i, -1)} className="size-8 rounded-lg border border-[#E6DAE2] bg-white text-xs disabled:opacity-30">↑</button>
                  <button type="button" aria-label={`Move ${p.title} down`} disabled={filtering || i === list!.length - 1} onClick={() => move(i, 1)} className="size-8 rounded-lg border border-[#E6DAE2] bg-white text-xs disabled:opacity-30">↓</button>
                </span>
                <Link href={`/admin/projects/${p.id}`} className="flex items-center gap-3 text-navy">
                  <span className="h-9 w-12 flex-none rounded-lg bg-cover bg-center" style={p.coverUrl ? { backgroundImage: `url(${p.coverUrl.replace("/upload/", "/upload/c_fill,w_120,h_90,q_auto,f_auto/")})` } : { background: covers[p.cat] }} />
                  <span className="flex min-w-0 flex-col"><span className="font-medium">{p.title}</span><span className="truncate text-xs text-[#5A5375]">{p.desc}</span></span>
                </Link>
                <span>{p.cat}</span>
                <span>
                  <button
                    type="button"
                    onClick={() => togglePublished(p)}
                    aria-label={p.published ? `${p.title} is published. Click to unpublish.` : `${p.title} is a draft. Click to publish.`}
                    className={`inline-flex items-center gap-1.5 rounded-full border-0 px-2.5 py-1 text-xs ${p.published ? "bg-[oklch(0.94_0.05_150)]" : "bg-[#F1E9EE]"}`}
                  >
                    <span className={`size-1.5 rounded-full ${p.published ? "bg-[oklch(0.6_0.14_150)]" : "bg-[#9A8FA0]"}`} />
                    {p.published ? "Published" : "Draft"}
                  </button>
                </span>
                <span className="text-[13px] text-[#5A5375]">{p.featured ? "★ Featured" : "—"}</span>
                <Link href={`/admin/projects/${p.id}`} className="flex min-h-9 items-center justify-center rounded-full border-[1.5px] border-[#DCCFD8] bg-white text-[13px] text-navy hover:border-navy">Edit</Link>
              </div>
            );
          })}
        </div>
      </Card>
      {list && list.length > 1 && !filtering && <p className="m-0 text-[13px] text-[#5A5375]">Use the arrows to set the order. Featured projects always appear first inside their category.</p>}
    </div>
  );
}
