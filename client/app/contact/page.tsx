import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/site";
import { Reveal, WordHeading } from "@/components/motion/Reveal";
import { QuoteForm } from "@/components/contact/QuoteForm";

export const metadata: Metadata = {
  title: "Get a quote · Atharv Doiphode",
  description: "Tell me what you need and I'll come back with a plan and a price.",
};

export default async function ContactPage() {
  const { services, profile } = await getSite();
  return (
    <main>
      <section data-screen-label="Contact / Get a quote" className="relative min-h-screen bg-blush px-[clamp(20px,5vw,72px)] pt-[clamp(120px,14vw,180px)] pb-[clamp(80px,10vw,140px)] text-navy">
        <div className="wrap grid gap-[clamp(40px,6vw,96px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))]">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex min-h-11 items-center self-start font-mono text-[13px] text-mute-l">← back home</Link>
            <WordHeading as="h1" text={"Get a\nquote"} className="m-0 font-display text-[clamp(56px,8vw,128px)] font-extrabold leading-[0.88] tracking-[-0.045em]" />
            <Reveal as="p" i={1} className="m-0 max-w-[420px] text-lg leading-[1.55] text-ink-2">
              Tell me what you need and I&apos;ll come back with a plan and a price. Prefer email? Write to me directly.
            </Reveal>
            <Reveal as="a" i={2} href={`mailto:${profile.email}`} className="self-start break-all border-b-2 border-navy pb-1 font-display text-[clamp(18px,1.8vw,24px)] font-semibold transition-colors hover:border-ultra hover:text-ultra">
              {profile.email}
            </Reveal>
            <Reveal i={3} className="mt-auto flex flex-col gap-2">
              {services.map((s) => (
                <div key={s.n} className="flex items-center gap-3 text-[15px]">
                  <span className="grid size-7 place-items-center rounded-lg font-mono text-[11px]" style={{ background: s.chip }}>{s.glyph}</span>
                  {s.title}
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal i={1} className="rounded-[28px] bg-paper p-[clamp(24px,3vw,40px)]">
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
