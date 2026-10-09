import { certificates } from "@/lib/data";
import { Reveal, WordHeading } from "@/components/motion/Reveal";

const issuers = [...new Set(certificates.map((c) => c.issuer))];

export function Certifications() {
  return (
    <section id="certifications" data-screen-label="06b Certifications" className="sec z-[6] bg-blush text-navy" style={{ paddingTop: "clamp(72px,9vw,128px)", paddingBottom: "clamp(72px,9vw,128px)" }}>
      <div className="wrap">
        <div className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-end justify-between gap-6">
          <WordHeading text="Certifications" className="h2 !text-[clamp(40px,5vw,80px)] !leading-[0.95]" />
          <Reveal i={1} className="flex flex-wrap items-center gap-2 font-mono text-[13px]">
            <span className="rounded-full bg-navy px-3.5 py-2 text-paper">{certificates.length} certificates</span>
            {issuers.map((name) => (
              <span key={name} className="rounded-full bg-white/60 px-3 py-2">{name}</span>
            ))}
          </Reveal>
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))]">
          {certificates.map((c, i) => (
            <Reveal
              key={c.file}
              i={i % 3}
              className="group flex min-h-[210px] flex-col gap-4 rounded-3xl bg-white p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(20,17,43,.45)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 flex-none place-items-center rounded-xl font-display text-[15px] font-extrabold" style={{ background: c.c }}>
                  {c.issuer.slice(0, 2)}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="font-display text-[15px] font-bold leading-tight">{c.issuer}</span>
                  {c.via && <span className="truncate font-mono text-[11px] text-mute-l">{c.via}</span>}
                </div>
                <span className="ml-auto flex-none rounded-full bg-lilac px-2.5 py-1 font-mono text-[11px] text-mute-l">{c.date}</span>
              </div>
              <span className="flex-1 font-display text-[clamp(19px,1.6vw,22px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance">{c.title}</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={c.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-10 items-center rounded-full bg-navy px-4 text-[14px] font-medium text-paper transition-colors hover:bg-ultra"
                >
                  View certificate ↗
                </a>
                {c.verify && (
                  <a
                    href={c.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-10 items-center rounded-full border-[1.5px] border-navy px-4 text-[14px] font-medium transition-colors hover:bg-navy hover:text-paper"
                  >
                    Verify ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
