import Link from "next/link";
import { Reveal, WordHeading } from "@/components/motion/Reveal";

export function ClosingCTA({ email, resumeHref }: { email: string; resumeHref: string }) {
  return (
    <section data-screen-label="10 Closing CTA" className="sec z-10 bg-blush text-navy" style={{ paddingTop: "clamp(88px,12vw,180px)", paddingBottom: "clamp(88px,12vw,180px)" }}>
      <div className="wrap flex flex-col gap-[clamp(32px,4vw,48px)]">
        <WordHeading text={"Got an idea?\nLet's build it."} className="h2 !text-[clamp(60px,11vw,184px)] !leading-[0.86] !tracking-[-0.05em]" />
        <Reveal i={1} className="flex flex-wrap items-center gap-3">
          <Link href="/contact" className="btn min-h-14 bg-navy px-[30px] py-[18px] text-[17px] text-paper hover:bg-ultra">Contact me →</Link>
          <Link href="/contact" className="btn min-h-14 border-[1.5px] border-navy px-[30px] py-[18px] text-[17px] hover:bg-navy hover:text-paper">Get a quote</Link>
        </Reveal>
        <Reveal i={2} className="flex flex-wrap items-center justify-between gap-5 border-t-[1.5px] border-navy pt-6">
          <a href={`mailto:${email}`} className="break-all font-display text-[clamp(20px,2.4vw,32px)] font-semibold tracking-[-0.02em] transition-colors hover:text-ultra">
            {email}
          </a>
          <a href={resumeHref} download className="flex min-h-12 items-center gap-2.5 rounded-full bg-paper px-5 py-3 text-[15px] font-medium transition-colors hover:bg-white">
            Résumé · PDF ↓
          </a>
        </Reveal>
      </div>
    </section>
  );
}
