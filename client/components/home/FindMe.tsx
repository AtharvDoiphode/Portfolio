import type { SiteData } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export function FindMe({ links }: { links: SiteData["links"] }) {
  return (
    <section data-screen-label="09 Find me" className="on-dark relative z-[9] bg-navy px-[clamp(20px,5vw,72px)] pb-[clamp(96px,11vw,160px)] text-paper">
      <div className="wrap">
        <Reveal as="h3" className="m-0 mb-6 font-mono text-[13px] font-normal tracking-[0.06em] text-mute-d">FIND ME</Reveal>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
          {links.map((l, i) => (
            <Reveal
              as="a"
              key={l.name}
              i={i}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[180px] flex-col justify-between gap-9 rounded-3xl border border-white/10 bg-navy-2 p-[22px] transition-colors duration-300 hover:bg-ultra"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl font-mono text-[13px] font-medium text-navy" style={{ background: l.c }}>{l.g}</span>
                <span className="text-xl">↗</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-2xl font-extrabold leading-[1.05] tracking-[-0.02em]">{l.name}</span>
                <span className="text-sm text-mist">{l.sub}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
