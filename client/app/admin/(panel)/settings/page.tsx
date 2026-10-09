"use client";

import { useEffect, useState, type ReactNode } from "react";
import { api, ApiError, type SettingsDoc } from "@/lib/admin-api";
import { chip } from "@/lib/data";
import { Button, Card, Field, MediaUpload, PageHead, Status, inputCls, smallInputCls } from "@/components/admin/ui";

const TABS = ["Services", "Skills", "Stats", "Links", "Profile"] as const;
type Tab = (typeof TABS)[number];
const HUES = [25, 300, 150, 85, 250];
const hueColor = (h: number) => (h < 0 ? "#EDE3E9" : chip(h));

/** Reorderable, removable list of rows. */
function RowList<T>({ items, onChange, render, make, addLabel, max = 12 }: {
  items: T[]; onChange: (v: T[]) => void; render: (item: T, set: (patch: Partial<T>) => void, i: number) => ReactNode; make: (i: number) => T; addLabel: string; max?: number;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-center gap-3 border-b border-[#F5EEF2] py-3">
          <span className="flex flex-col">
            <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="h-5 w-7 border-0 bg-transparent text-xs text-[#5A5375] disabled:opacity-25">▲</button>
            <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="h-5 w-7 border-0 bg-transparent text-xs text-[#5A5375] disabled:opacity-25">▼</button>
          </span>
          {render(it, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))), i)}
          <button type="button" aria-label="Remove row" onClick={() => onChange(items.filter((_, k) => k !== i))} className="size-10 rounded-[10px] border-0 bg-transparent text-[#5A5375] hover:bg-[#F6F1F4]">✕</button>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, make(items.length)])} className="my-3.5 min-h-[42px] rounded-full border-[1.5px] border-dashed border-[#C9B9C5] bg-transparent px-4 text-sm hover:border-ultra hover:text-ultra">
          + {addLabel}
        </button>
      )}
    </div>
  );
}

function SkillItems({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(items.join(", "));
  return (
    <input
      value={text}
      aria-label="Skills, separated by commas"
      placeholder="TypeScript, JavaScript, Python"
      onChange={(e) => { setText(e.target.value); onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean)); }}
      className={`${smallInputCls} flex-[2_1_240px]`}
    />
  );
}

export default function SettingsPage() {
  const [doc, setDoc] = useState<SettingsDoc | null>(null);
  const [missing, setMissing] = useState(false);
  const [tab, setTab] = useState<Tab>("Services");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<SettingsDoc | null>("GET", "/api/admin/settings")
      .then((d) => (d ? setDoc(d) : setMissing(true)))
      .catch((e) => setMsg({ kind: "error", text: e.message }));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (missing) return <Status kind="error">Nothing to edit yet: the database hasn&apos;t been filled. Run <code>npm run seed</code> in the server folder, then refresh.</Status>;
  if (!doc) return msg ? <Status kind="error">{msg.text}</Status> : <p className="font-mono text-sm text-[#5A5375]">Loading…</p>;

  const update = <K extends keyof SettingsDoc>(k: K, v: SettingsDoc[K]) => { setDoc({ ...doc, [k]: v }); setDirty(true); setMsg(null); };
  const setProfile = (patch: Partial<SettingsDoc["profile"]>) => update("profile", { ...doc.profile, ...patch });

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const saved = await api<SettingsDoc>("PUT", "/api/admin/settings", doc);
      setDoc(saved); setDirty(false);
      setMsg({ kind: "ok", text: "Saved. Changes are live on the site within a few seconds." });
    } catch (e) {
      const err = e as ApiError;
      const first = err.fields ? Object.entries(err.fields)[0] : null;
      setMsg({ kind: "error", text: first ? `${first[0].replace(/\./g, " › ")}: ${first[1]}` : err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-[1000px] flex-col gap-5">
      <PageHead kicker="SITE SETTINGS" title="Site settings">
        <Button variant="primary" onClick={save} disabled={busy || !dirty}>{busy ? "Saving…" : dirty ? "Save changes" : "Saved"}</Button>
      </PageHead>
      {msg && <Status kind={msg.kind}>{msg.text}</Status>}

      <div role="tablist" className="flex flex-wrap gap-1 self-start rounded-full bg-[#EDE3E9] p-1">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`min-h-10 rounded-full border-0 px-[18px] text-sm font-medium ${tab === t ? "bg-white shadow-[0_1px_3px_rgba(20,17,43,.12)]" : "bg-transparent"}`}>
            {t}
          </button>
        ))}
      </div>

      <Card className="px-5 py-2">
        {tab === "Services" && (
          <RowList items={doc.services} onChange={(v) => update("services", v)} addLabel="Add service"
            make={(i) => ({ glyph: "★", hue: HUES[i % HUES.length], title: "", short: "", desc: "" })}
            render={(s, set) => (
              <>
                <input aria-label="Icon" value={s.glyph} maxLength={4} onChange={(e) => set({ glyph: e.target.value })} style={{ background: hueColor(s.hue) }} className="size-10 rounded-[10px] border-0 text-center font-mono text-xs outline-none" />
                <input aria-label="Title" placeholder="Title" value={s.title} maxLength={80} onChange={(e) => set({ title: e.target.value })} className={`${smallInputCls} flex-[1_1_180px] font-medium`} />
                <input aria-label="Short label (shown on the badge)" placeholder="Short label for the badge" value={s.short} maxLength={80} onChange={(e) => set({ short: e.target.value })} className={`${smallInputCls} flex-[1_1_180px]`} />
                <input aria-label="Description" placeholder="Description" value={s.desc} maxLength={300} onChange={(e) => set({ desc: e.target.value })} className={`${smallInputCls} flex-[2_1_260px]`} />
              </>
            )} />
        )}
        {tab === "Skills" && (
          <RowList items={doc.skills} onChange={(v) => update("skills", v)} addLabel="Add skill group"
            make={() => ({ group: "", items: [] })}
            render={(g, set) => (
              <>
                <input aria-label="Group name" placeholder="Group (e.g. Frontend)" value={g.group} maxLength={40} onChange={(e) => set({ group: e.target.value })} className={`${smallInputCls} flex-[1_1_160px] font-medium`} />
                <SkillItems items={g.items} onChange={(items) => set({ items })} />
              </>
            )} />
        )}
        {tab === "Stats" && (
          <>
            <p className="m-0 pt-3 text-[13px] text-[#5A5375]">Numbers only count up if they start with a digit: 4, 8.28, 30k. Keep these real.</p>
            <RowList items={doc.stats} onChange={(v) => update("stats", v)} addLabel="Add stat" max={6}
              make={() => ({ value: "", label: "" })}
              render={(s, set) => (
                <>
                  <input aria-label="Number" placeholder="30k" value={s.value} maxLength={12} onChange={(e) => set({ value: e.target.value })} className={`${smallInputCls} w-28 font-mono font-medium`} />
                  <input aria-label="Label" placeholder="what it counts" value={s.label} maxLength={60} onChange={(e) => set({ label: e.target.value })} className={`${smallInputCls} flex-[2_1_240px]`} />
                </>
              )} />
          </>
        )}
        {tab === "Links" && (
          <>
            <p className="m-0 pt-3 text-[13px] text-[#5A5375]">The first GitHub, LinkedIn and Instagram rows (by icon text GH, in, IG) also appear in the footer and About section.</p>
            <RowList items={doc.links} onChange={(v) => update("links", v)} addLabel="Add link"
              make={(i) => ({ g: "↗", hue: HUES[i % HUES.length], name: "", sub: "", href: "https://" })}
              render={(l, set) => (
                <>
                  <input aria-label="Icon text" value={l.g} maxLength={4} onChange={(e) => set({ g: e.target.value })} style={{ background: hueColor(l.hue) }} className="size-10 rounded-[10px] border-0 text-center font-mono text-xs outline-none" />
                  <input aria-label="Name" placeholder="Name" value={l.name} maxLength={60} onChange={(e) => set({ name: e.target.value })} className={`${smallInputCls} flex-[1_1_150px] font-medium`} />
                  <input aria-label="Detail" placeholder="Detail" value={l.sub} maxLength={80} onChange={(e) => set({ sub: e.target.value })} className={`${smallInputCls} flex-[1_1_170px]`} />
                  <input aria-label="URL" placeholder="https://…" value={l.href} onChange={(e) => set({ href: e.target.value })} className={`${smallInputCls} flex-[2_1_240px]`} />
                </>
              )} />
          </>
        )}
        {tab === "Profile" && (
          <div className="grid gap-6 py-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            <div className="flex flex-col gap-5">
              <div><div className="mb-2 text-[13px] font-medium">Badge photo <span className="font-normal text-[#5A5375]">3:4, hero</span></div><MediaUpload kind="image" value={doc.profile.photoUrl} onChange={(u) => setProfile({ photoUrl: u })} aspect="3/4" label="portrait" /></div>
              <div><div className="mb-2 text-[13px] font-medium">Intro photo <span className="font-normal text-[#5A5375]">portrait, intro section</span></div><MediaUpload kind="image" value={doc.profile.introPhotoUrl} onChange={(u) => setProfile({ introPhotoUrl: u })} aspect="3/4" label="portrait" /></div>
              <div><div className="mb-2 text-[13px] font-medium">About photo <span className="font-normal text-[#5A5375]">4:5</span></div><MediaUpload kind="image" value={doc.profile.aboutPhotoUrl} onChange={(u) => setProfile({ aboutPhotoUrl: u })} aspect="4/5" label="portrait" /></div>
            </div>
            <div className="flex flex-col gap-3.5">
              <Field label="Name"><input value={doc.profile.name} maxLength={80} onChange={(e) => setProfile({ name: e.target.value })} className={inputCls} /></Field>
              <Field label="Headline"><input value={doc.profile.headline} maxLength={160} onChange={(e) => setProfile({ headline: e.target.value })} className={inputCls} /></Field>
              <Field label="Location"><input value={doc.profile.location} maxLength={80} onChange={(e) => setProfile({ location: e.target.value })} className={inputCls} /></Field>
              <Field label="Email" hint="shown across the site"><input type="email" value={doc.profile.email} onChange={(e) => setProfile({ email: e.target.value })} className={inputCls} /></Field>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
