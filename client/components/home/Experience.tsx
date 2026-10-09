import { C, experience } from "@/lib/data";
import type { SiteData } from "@/lib/site";
import { Reveal, WordHeading } from "@/components/motion/Reveal";

// Skill groups come from /admin as plain { group, items }; the icon and colour are picked here.
const palette = [C.coral, C.lilac, C.green, C.yellow, C.blue];
const glyphs: [RegExp, string][] = [
  [/lang/i, "{ }"], [/front/i, "</>"], [/back/i, "⇄"], [/data ?base/i, "▤"], [/analytic|data/i, "▦"],
  [/ai tool/i, "▶"], [/ai|ml/i, "✦"], [/tool|deploy/i, "⚙"],
];
const glyphFor = (group: string) => glyphs.find(([re]) => re.test(group))?.[1] ?? "•";

// "Docker (familiar)" -> dashed chip reading "Docker", matching the résumé's "Familiar:" notes.
const FAMILIAR = /\s*\(familiar\)\s*$/i;

export function Experience({ skills }: { skills: SiteData["skills"] }) {
  return (
    <section id="about-exp" data-screen-label="06 Experience" className="sec on-dark z-[6] bg-navy text-paper">
      <div className="wrap">
        <div className="mb-[clamp(40px,5vw,72px)]">
          <WordHeading text={"Experience\n& skills"} />
        </div>
        <div className="grid gap-[clamp(40px,5vw,80px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]">
          <div className="flex flex-col">
            {experience.map((x, i) => (
              <Reveal key={x.title} i={i} className="grid grid-cols-[20px_1fr] gap-4 pb-8">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 size-3.5 rounded-full ring-4 ring-white/5" style={{ background: x.dot }} />
                  {i < experience.length - 1 && <span className="mt-2 w-[1.5px] flex-1 bg-white/15" />}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[13px]">
                    <span className="text-ultra-soft">{x.when}</span>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] tracking-[0.04em] text-mist">{x.org}</span>
                  </span>
                  <span className="font-display text-[clamp(24px,2.4vw,32px)] font-extrabold leading-[1.05] tracking-[-0.025em]">{x.title}</span>
                  <span className="max-w-[560px] text-base leading-normal text-mist">{x.desc}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid content-start gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
              {skills.map((g, i) => {
                const c = palette[i % palette.length];
                return (
                  <Reveal
                    key={g.group}
                    i={i % 4}
                    className="group relative flex flex-col gap-3.5 overflow-hidden rounded-[20px] border border-white/10 bg-navy-2 p-[18px] transition-colors duration-300 hover:border-white/25"
                  >
                    {/* accent bar in the group colour */}
                    <span className="absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity group-hover:opacity-100" style={{ background: c }} />
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 flex-none place-items-center rounded-[10px] font-mono text-[12px] font-medium text-navy" style={{ background: c }}>
                        {glyphFor(g.group)}
                      </span>
                      <span className="font-display text-[17px] font-bold tracking-[-0.01em]">{g.group}</span>
                      <span className="ml-auto font-mono text-[11px] text-mute-d">{String(g.items.length).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.items.map((it) =>
                        FAMILIAR.test(it) ? (
                          <span key={it} className="rounded-full border border-dashed border-white/30 px-[10px] py-[5px] text-sm text-mist">{it.replace(FAMILIAR, "")}</span>
                        ) : (
                          <span key={it} className="rounded-full bg-white/10 px-[11px] py-1.5 text-sm transition-colors hover:bg-white/20">{it}</span>
                        ),
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
            {skills.some((g) => g.items.some((it) => FAMILIAR.test(it))) && (
              <span className="flex items-center gap-2 font-mono text-[11px] text-mute-d">
                <span className="inline-block h-3 w-5 rounded-full border border-dashed border-white/30" />
                familiar, still building depth
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
