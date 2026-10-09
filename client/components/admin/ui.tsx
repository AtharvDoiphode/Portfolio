"use client";

import { useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { uploadMedia, type MediaKind } from "@/lib/upload";
import { img, videoPoster } from "@/lib/media";

export const inputCls =
  "min-h-[46px] w-full rounded-xl border-[1.5px] border-[#DCCFD8] bg-white px-3.5 text-[15px] text-navy outline-none placeholder:text-[#9A8FA0] focus:border-ultra focus:shadow-[0_0_0_3px_rgba(59,75,255,.2)]";
export const smallInputCls =
  "min-h-[42px] rounded-[10px] border-[1.5px] border-[#E6DAE2] bg-white px-3 text-sm text-navy outline-none placeholder:text-[#9A8FA0] focus:border-ultra";

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-xs text-[#5A5375]">{kicker}</div>
        <h1 className="m-0 mt-1.5 font-display text-[clamp(32px,3.4vw,44px)] font-extrabold tracking-[-0.03em] text-navy">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2.5">{children}</div>}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[20px] border border-[#EADFE6] bg-white ${className}`}>{children}</div>;
}

type Variant = "primary" | "ghost" | "danger";
export function Button({ variant = "ghost", className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v: Record<Variant, string> = {
    primary: "border-0 bg-ultra text-white hover:bg-ultra-hi font-medium px-5",
    ghost: "border-[1.5px] border-[#DCCFD8] bg-white text-navy hover:border-navy px-[18px]",
    danger: "border-[1.5px] border-[#E7B9B5] bg-white text-[#B3261E] hover:bg-[#FDF1F0] px-[18px]",
  };
  return <button {...rest} className={`min-h-11 rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${v[variant]} ${className}`} />;
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-[7px] text-[13px] font-medium text-navy">
      <span>
        {label} {hint && <span className="font-normal text-[#5A5375]">{hint}</span>}
      </span>
      {children}
      {error && <span role="alert" className="font-normal text-[#B3261E]">{error}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F5EEF2] py-3.5 last:border-b-0">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-[#5A5375]">{sub}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`flex h-[30px] w-[52px] flex-none rounded-full border-0 p-[3px] transition-colors ${checked ? "justify-end bg-ultra" : "justify-start bg-[#D9CCD6]"}`}
      >
        <span className="size-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)]" />
      </button>
    </div>
  );
}

export function Status({ kind = "ok", children }: { kind?: "ok" | "error"; children: ReactNode }) {
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`rounded-[14px] px-4 py-3 text-sm ${kind === "error" ? "bg-[#FDECEA] text-[#8C1D18]" : "bg-[oklch(0.92_0.06_150)] text-navy"}`}>
      {children}
    </div>
  );
}

export function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim().replace(/,$/, "");
    if (t && !value.includes(t) && value.length < 10) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-xl border-[1.5px] border-[#DCCFD8] bg-white p-1.5 focus-within:border-ultra">
      {value.map((t) => (
        <span key={t} className="flex items-center gap-1.5 rounded-full bg-[#F1E6EC] px-2.5 py-1.5 font-mono text-xs">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="border-0 bg-transparent p-0 text-[#5A5375] hover:text-navy">×</button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={value.length ? "" : "Type a tag, press Enter"}
        aria-label="Add tag"
        className="min-w-[100px] flex-1 border-0 bg-transparent p-1.5 text-sm outline-none"
      />
    </div>
  );
}

/** Drop-zone / browse button that uploads to Cloudinary and reports the resulting URL. */
export function MediaUpload({
  kind, value, onChange, aspect = "16/10", label,
}: { kind: MediaKind; value: string; onChange: (url: string) => void; aspect?: string; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);

  async function handle(file?: File) {
    if (!file) return;
    setErr("");
    setPct(0);
    try {
      onChange(await uploadMedia(file, kind, setPct));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setPct(null);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files[0]); }}
        style={{ aspectRatio: aspect }}
        className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[14px] border-[1.5px] border-dashed p-4 text-center ${over ? "border-ultra bg-[#EEF0FF]" : "border-[#C9B9C5] bg-[repeating-linear-gradient(135deg,#EFE6EC_0_1px,#F7F1F4_1px_9px)]"}`}
      >
        {value && kind === "image" && <img src={img(value, 700)} alt="" className="absolute inset-0 size-full object-cover" />}
        {value && kind === "video" && (
          <video src={value} poster={videoPoster(value, 600) || undefined} controls preload="metadata" playsInline className="absolute inset-0 size-full bg-navy object-contain" />
        )}
        {!value && (
          <>
            <span className="text-sm font-medium">
              Drop {kind} or{" "}
              <button type="button" onClick={() => input.current?.click()} className="border-0 bg-transparent p-0 text-ultra underline">browse</button>
            </span>
            <span className="font-mono text-[11px] text-[#5A5375]">{kind === "image" ? "JPG, PNG, WebP · up to 10 MB" : "MP4, MOV · up to 100 MB"} · {label}</span>
          </>
        )}
        {pct !== null && (
          <div className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 p-2" role="progressbar" aria-valuenow={pct} aria-label="Upload progress">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E6DAE2]"><div className="h-full bg-ultra transition-all" style={{ width: `${pct}%` }} /></div>
            <div className="mt-1 font-mono text-[11px] text-[#5A5375]">Uploading… {pct}%</div>
          </div>
        )}
      </div>
      <input ref={input} type="file" accept={kind === "image" ? "image/*" : "video/*"} className="sr-only" aria-label={`Choose ${kind} file`} onChange={(e) => handle(e.target.files?.[0])} />
      {value && (
        <div className="flex gap-2">
          <Button type="button" className="!min-h-9 !px-3.5 text-[13px]" onClick={() => input.current?.click()}>Replace</Button>
          <Button type="button" className="!min-h-9 !px-3.5 text-[13px]" onClick={() => onChange("")}>Remove</Button>
        </div>
      )}
      {err && <span role="alert" className="text-[13px] text-[#B3261E]">{err}</span>}
    </div>
  );
}
