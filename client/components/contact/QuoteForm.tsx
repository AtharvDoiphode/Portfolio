"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { needOptions } from "@/lib/data";
import { QuoteError, submitQuote, warmApi } from "@/lib/api";
import { useSite } from "@/components/SiteContext";

const field =
  "min-h-[52px] rounded-[14px] border-[1.5px] border-[#D9CCD6] bg-white px-4 text-base text-navy outline-none focus:border-ultra focus:shadow-[0_0_0_3px_rgba(59,75,255,.2)]";
const label = "flex flex-col gap-2 text-sm font-medium";

export function QuoteForm() {
  const [needs, setNeeds] = useState<string[]>(["Website"]);
  const { profile } = useSite();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => warmApi(), []);

  const toggle = (n: string) => setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      await submitQuote({
        name: String(f.get("name")),
        email: String(f.get("email")),
        needs,
        budget: String(f.get("budget") || ""),
        timeline: String(f.get("timeline") || ""),
        message: String(f.get("message")),
        website: String(f.get("website") || ""),
      });
      setState("sent");
    } catch (err) {
      setError(
        err instanceof QuoteError && err.kind !== "network" && err.kind !== "server"
          ? err.message
          : `Couldn't send that just now. Please try again, or email me at ${profile.email}.`,
      );
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col justify-center gap-4">
        <span className="grid size-14 place-items-center rounded-[18px] bg-chip-green text-2xl">✓</span>
        <div className="font-display text-[44px] font-extrabold leading-none tracking-[-0.035em]">Got it, thanks.</div>
        <p className="m-0 max-w-[380px] text-[17px] leading-normal text-mute-l">Your request is in my inbox. I&apos;ll reply to the email you gave.</p>
        <Link href="/" className="btn mt-2 self-start bg-navy text-paper">Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-[22px]">
      {/* honeypot: hidden from people, bots fill it in */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        <label className={label}>Your name<input name="name" required placeholder="Full name" autoComplete="name" className={field} /></label>
        <label className={label}>Email<input name="email" required type="email" placeholder="you@company.com" autoComplete="email" className={field} /></label>
      </div>

      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 text-sm font-medium">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {needOptions.map((n) => {
            const on = needs.includes(n);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(n)}
                className={`min-h-11 rounded-full border-[1.5px] px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${on ? "border-navy bg-navy text-paper" : "border-[#D9CCD6] bg-white text-navy"}`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        <label className={label}>
          <span>Budget <span className="text-[13px] font-normal text-mute-l">optional</span></span>
          <input name="budget" placeholder="e.g. ₹15,000" className={field} />
        </label>
        <label className={label}>
          <span>Timeline <span className="text-[13px] font-normal text-mute-l">optional</span></span>
          <input name="timeline" placeholder="e.g. in 3 weeks" className={field} />
        </label>
      </div>

      <label className={label}>
        Tell me about the project
        <textarea name="message" required rows={5} placeholder="What are you building, who is it for, any links?" className={`${field} resize-y py-3.5`} />
      </label>

      {state === "error" && <p role="alert" className="m-0 text-sm text-[#B3261E]">{error}</p>}

      <button type="submit" disabled={state === "sending"} className="btn min-h-[52px] self-start bg-ultra px-7 py-4 text-base text-white hover:bg-ultra-hi disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send request →"}
      </button>
    </form>
  );
}
