"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/admin-api";
import { Field, inputCls, Status } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("GET", "/api/auth/me").then(() => router.replace("/admin")).catch(() => {});
  }, [router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError(""); setSlow(false);
    const t = setTimeout(() => setSlow(true), 4000);
    try {
      await api("POST", "/api/auth/login", { email: String(f.get("email")), password: String(f.get("password")) });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setBusy(false);
    } finally {
      clearTimeout(t);
      setSlow(false);
    }
  }

  return (
    <div className="grid min-h-screen [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
      <div className="flex min-h-[280px] flex-col justify-between gap-12 bg-navy p-[clamp(32px,5vw,64px)] text-paper">
        <span className="font-display text-2xl font-extrabold tracking-[-0.03em]">
          atharv<span className="text-ultra-soft">*</span> <span className="font-mono text-xs font-normal tracking-normal text-mute-d">admin</span>
        </span>
        <div className="font-display text-[clamp(44px,5vw,80px)] font-extrabold leading-[0.9] tracking-[-0.04em]">Back to<br />the workshop.</div>
        <span className="font-mono text-xs text-mute-d">Private · only Atharv signs in here</span>
      </div>
      <div className="flex items-center justify-center p-[clamp(32px,5vw,64px)]">
        <form onSubmit={submit} className="flex w-full max-w-[380px] flex-col gap-[18px]">
          <h1 className="m-0 mb-1.5 font-display text-4xl font-extrabold tracking-[-0.03em]">Sign in</h1>
          <Field label="Email"><input name="email" type="email" required autoComplete="username" className={inputCls} /></Field>
          <Field label="Password"><input name="password" type="password" required autoComplete="current-password" className={inputCls} /></Field>
          {error && <Status kind="error">{error}</Status>}
          <button type="submit" disabled={busy} className="min-h-[50px] rounded-full border-0 bg-ultra text-[15px] font-medium text-white hover:bg-ultra-hi disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in →"}
          </button>
          {slow && <span className="text-[13px] text-[#5A5375]">The server was asleep and is waking up. This can take up to a minute the first time.</span>}
          <span className="text-[13px] text-[#5A5375]">Sessions expire after 7 days.</span>
        </form>
      </div>
    </div>
  );
}
