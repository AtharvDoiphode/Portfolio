import type { SiteData } from "@/lib/site";
import { Reveal, WordHeading } from "@/components/motion/Reveal";

export function Services({ services }: { services: SiteData["services"] }) {
  return (
    <section id="services" data-screen-label="03 What I do" className="sec on-dark z-[3] bg-navy text-paper">
      <div className="wrap">
        <div className="mb-[clamp(40px,5vw,72px)] flex flex-wrap items-end justify-between gap-6">
          <WordHeading text="What I do" />
          <Reveal as="p" i={1} className="m-0 max-w-[340px] text-base leading-normal text-mute-d">
            {services.length === 4 ? "Four" : services.length} things I take on for clients, start to finish.
          </Reveal>
        </div>
        <div className="flex flex-col">
          {services.map((s, i) => (
            <Reveal
              key={s.n}
              i={i}
              className="grid items-center gap-x-10 gap-y-4 border-t border-white/15 py-[clamp(22px,3vw,36px)] transition-colors duration-200 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] hover:border-t-ultra-soft/60"
            >
              <div className="flex items-center gap-[clamp(14px,2vw,24px)]">
                <span
                  className="grid size-[clamp(48px,5vw,68px)] flex-none place-items-center rounded-[18px] font-mono text-[clamp(14px,1.4vw,18px)] font-medium text-navy"
                  style={{ background: s.chip }}
                >
                  {s.glyph}
                </span>
                <span className="text-balance font-display text-[clamp(28px,3.6vw,56px)] font-extrabold leading-[0.95] tracking-[-0.03em]">{s.title}</span>
              </div>
              <div className="flex items-center justify-between gap-5">
                <p className="m-0 max-w-[420px] text-[17px] leading-normal text-mist">{s.desc}</p>
                <span className="font-mono text-[13px] text-mute-d">{s.n}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
