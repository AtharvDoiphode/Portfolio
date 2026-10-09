import { learning } from "@/lib/data";
import { Reveal, WordHeading } from "@/components/motion/Reveal";

export function Learning() {
  return (
    <section data-screen-label="07 Currently learning" className="sec z-[7] bg-lilac text-navy" style={{ paddingTop: "clamp(72px,9vw,128px)", paddingBottom: "clamp(72px,9vw,128px)" }}>
      <div className="wrap">
        <div className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-center gap-4">
          <WordHeading text="Currently learning" className="h2 !text-[clamp(40px,5vw,80px)] !leading-[0.95]" />
          <Reveal as="span" i={1} className="flex items-center gap-2 rounded-full bg-blush px-3.5 py-2 font-mono text-[13px]">
            <span className="size-2 rounded-full bg-ultra" />
            in progress
          </Reveal>
        </div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {learning.map((l, i) => (
            <Reveal key={l.title} i={i} className="flex min-h-[220px] flex-col gap-5 rounded-3xl bg-white p-6">
              <span className="font-mono text-xs text-mute-l">0{i + 1}</span>
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="font-display text-[26px] font-extrabold leading-[1.05] tracking-[-0.025em]">{l.title}</span>
                <span className="text-[15px] text-mute-l">{l.sub}</span>
              </div>
              <div className="flex gap-1" aria-label="In progress">
                {[0, 1, 2, 3, 4].map((k) => (
                  <span key={k} className={`h-1.5 flex-1 rounded-full ${k < l.level ? "bg-ultra" : "bg-blush"}`} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
