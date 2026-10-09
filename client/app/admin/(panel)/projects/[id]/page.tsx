"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError, type AdminProject } from "@/lib/admin-api";
import { Button, Card, Field, MediaUpload, PageHead, Status, TagInput, Toggle, inputCls } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/AdminShell";

const CATS = ["Websites", "AI Videos", "Excel", "Research"] as const;
const blank: Omit<AdminProject, "id" | "slug" | "order"> = {
  title: "", cat: "Websites", desc: "", long: "", tags: [], liveUrl: "", liveLabel: "", codeUrl: "", codeLabel: "",
  ph: "", coverUrl: "", videoUrl: "", featured: false, published: false,
};

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const { refresh } = useAdmin();
  const [form, setForm] = useState<typeof blank | null>(isNew ? blank : null);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api<AdminProject[]>("GET", "/api/admin/projects")
      .then((all) => {
        const p = all.find((x) => x.id === id);
        if (!p) return setMsg({ kind: "error", text: "That project no longer exists." });
        const { id: _i, slug: _s, order: _o, ...rest } = p;
        void _i; void _s; void _o;
        setForm(rest);
      })
      .catch((e) => setMsg({ kind: "error", text: e.message }));
  }, [id, isNew]);

  if (!form) return msg ? <Status kind="error">{msg.text}</Status> : <p className="font-mono text-sm text-[#5A5375]">Loading…</p>;
  const set = <K extends keyof typeof blank>(k: K, v: (typeof blank)[K]) => setForm((f) => ({ ...f!, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null); setFields({});
    try {
      if (isNew) {
        const created = await api<AdminProject>("POST", "/api/admin/projects", form);
        refresh();
        router.replace(`/admin/projects/${created.id}`);
      } else {
        await api("PUT", `/api/admin/projects/${id}`, form);
        refresh();
        setMsg({ kind: "ok", text: form!.published ? "Saved. Changes are live on the site within a few seconds." : "Saved as a draft. It is not visible on the site yet." });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setFields(err.fields ?? {});
        setMsg({ kind: "error", text: err.message });
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirmDelete) return setConfirmDelete(true);
    try {
      await api("DELETE", `/api/admin/projects/${id}`);
      refresh();
      router.replace("/admin/projects");
    } catch (err) {
      setMsg({ kind: "error", text: (err as Error).message });
    }
  }

  return (
    <form onSubmit={save} className="flex max-w-[1200px] flex-col gap-5">
      <PageHead kicker="← PROJECTS" title={isNew ? "New project" : form.title || "Project"}>
        <Button type="button" onClick={() => router.push("/admin/projects")}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={busy}>{busy ? "Saving…" : isNew ? "Create project" : "Save changes"}</Button>
      </PageHead>
      {msg && <Status kind={msg.kind}>{msg.text}</Status>}

      <div className="grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        <Card className="flex flex-col gap-4 p-[22px]">
          <Field label="Title" error={fields.title}>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required maxLength={120} placeholder="Project title" className={inputCls} />
          </Field>
          <div className="flex flex-col gap-[7px] text-[13px] font-medium" role="group" aria-label="Category">
            Category
            <div className="flex flex-wrap gap-1.5">
              {CATS.map((c) => (
                <button key={c} type="button" aria-pressed={form.cat === c} onClick={() => set("cat", c)}
                  className={`min-h-10 rounded-full border-[1.5px] px-3.5 text-[13px] whitespace-nowrap ${form.cat === c ? "border-navy bg-navy text-paper" : "border-[#DCCFD8] bg-white text-navy"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Field label="Short description" hint={`${form.desc.length}/200`} error={fields.desc}>
            <input value={form.desc} onChange={(e) => set("desc", e.target.value)} maxLength={200} placeholder="One line for the card" className={inputCls} />
          </Field>
          <Field label="Full description" hint="shown in the project popup" error={fields.long}>
            <textarea value={form.long} onChange={(e) => set("long", e.target.value)} rows={5} maxLength={2000} className={`${inputCls} resize-y py-3`} />
          </Field>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
            <Field label="Main button link" error={fields.liveUrl}>
              <input value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://… or /contact" className={inputCls} />
            </Field>
            <Field label="Main button text">
              <input value={form.liveLabel} onChange={(e) => set("liveLabel", e.target.value)} maxLength={40} placeholder="Visit site" className={inputCls} />
            </Field>
            <Field label="Second button link" error={fields.codeUrl}>
              <input value={form.codeUrl} onChange={(e) => set("codeUrl", e.target.value)} placeholder="https://github.com/…" className={inputCls} />
            </Field>
            <Field label="Second button text">
              <input value={form.codeLabel} onChange={(e) => set("codeLabel", e.target.value)} maxLength={40} placeholder="View code" className={inputCls} />
            </Field>
          </div>
          <div className="flex flex-col gap-[7px] text-[13px] font-medium">Tags<TagInput value={form.tags} onChange={(v) => set("tags", v)} /></div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3.5 p-[22px]">
            <span className="text-[13px] font-medium">Cover image</span>
            <MediaUpload kind="image" value={form.coverUrl} onChange={(u) => set("coverUrl", u)} label="4:3 looks best" aspect="4/3" />
            <span className="text-[13px] font-medium">Video <span className="font-normal text-[#5A5375]">optional, replaces the cover in the popup</span></span>
            <MediaUpload kind="video" value={form.videoUrl} onChange={(u) => set("videoUrl", u)} label="short clips work best" aspect="16/9" />
          </Card>
          <Card className="px-[22px] py-2">
            <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" sub="Show first in its category on the homepage" />
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" sub="Visible on the live site" />
          </Card>
          {!isNew && (
            <div className="flex items-center gap-3">
              <Button type="button" variant="danger" onClick={remove}>{confirmDelete ? "Click again to delete for good" : "Delete project"}</Button>
              {confirmDelete && <button type="button" onClick={() => setConfirmDelete(false)} className="border-0 bg-transparent text-sm text-[#5A5375] underline">Keep it</button>}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
