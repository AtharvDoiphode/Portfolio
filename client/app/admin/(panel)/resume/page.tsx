"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError, type Overview } from "@/lib/admin-api";
import { Card, PageHead, Status } from "@/components/admin/ui";

const MAX_MB = 4;

export default function ResumePage() {
  const input = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState<Overview["resume"] | undefined>(undefined);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  const load = () => api<Overview>("GET", "/api/admin/overview").then((o) => setInfo(o.resume)).catch((e) => setMsg({ kind: "error", text: e.message }));
  useEffect(() => { load(); }, []);

  async function upload(file?: File) {
    if (!file) return;
    setMsg(null);
    if (file.type !== "application/pdf") return setMsg({ kind: "error", text: "Please choose a PDF file." });
    if (file.size > MAX_MB * 1024 * 1024) return setMsg({ kind: "error", text: `That PDF is over ${MAX_MB} MB. Please compress it and try again.` });
    setBusy(true);
    try {
      await api("PUT", "/api/admin/resume", undefined, { raw: file, headers: { "content-type": "application/pdf", "x-filename": file.name } });
      setMsg({ kind: "ok", text: "Résumé replaced. The download buttons on your site now serve this file." });
      await load();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof ApiError ? e.message : "Upload failed." });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex max-w-[720px] flex-col gap-5">
      <PageHead kicker="RESUME" title="Résumé" />
      {msg && <Status kind={msg.kind}>{msg.text}</Status>}
      <Card className="flex flex-wrap items-center gap-4 p-[22px]">
        <span className="grid h-16 w-[52px] place-items-center rounded-[10px] bg-navy font-mono text-xs text-paper">PDF</span>
        <span className="flex flex-1 flex-col gap-[3px]">
          <span className="font-medium">{info === undefined ? "Loading…" : info ? info.filename : "Using the bundled default copy"}</span>
          <span className="text-[13px] text-[#5A5375]">
            {info ? `${(info.size / 1024).toFixed(0)} KB · uploaded ${new Date(info.updatedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} · ` : ""}
            Linked from the homepage and the closing section
          </span>
        </span>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-ultra">Preview ↗</a>
      </Card>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files[0]); }}
        className={`flex flex-col items-center gap-2 rounded-[20px] border-[1.5px] border-dashed px-5 py-12 text-center ${over ? "border-ultra bg-[#EEF0FF]" : "border-[#C9B9C5] bg-[repeating-linear-gradient(135deg,#EFE6EC_0_1px,#F7F1F4_1px_9px)]"}`}
      >
        <span className="font-medium">{busy ? "Uploading…" : <>Drop a new PDF here or <button type="button" onClick={() => input.current?.click()} className="border-0 bg-transparent p-0 text-ultra underline">browse</button></>}</span>
        <span className="font-mono text-xs text-[#5A5375]">PDF only · up to {MAX_MB} MB</span>
        <input ref={input} type="file" accept="application/pdf" className="sr-only" aria-label="Choose résumé PDF" onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      <p className="m-0 text-[13px] text-[#5A5375]">Anyone can open this file from your public site, so check it doesn&apos;t include details you don&apos;t want public, such as a phone number.</p>
    </div>
  );
}
