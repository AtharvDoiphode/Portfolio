import { aboutBullets } from "@/lib/data";
import { socialFrom, type SiteData } from "@/lib/site";
import { Reveal, WordHeading } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";

export function About({ links, photoUrl }: { links: SiteData["links"]; photoUrl: string }) {
  const socialChips = socialFrom(links);
  return (
    <section id="about" data-screen-label="08 About" className="sec on-dark z-[8] bg-navy text-paper">
      <div className="wrap grid items-center gap-[clamp(40px,6vw,96px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
        <Reveal>
          {/* 700:758 matches the bundled photo, so it's shown whole instead of upscaled into a 4:5 crop */}
          <Photo url={photoUrl} alt="Atharv Doiphode seated in a dark suit against a dark backdrop" width={828} position="center" a="#2A2550" b="#1E1A3D" step={10} className="mx-auto flex aspect-[700/758] w-full max-w-[700px] flex-col justify-end rounded-[28px] p-5">
            {/* The "intro video" play badge from the design returns once a real video is uploaded. */}
            <span className="font-mono text-xs text-mute-d">photo or video of Atharv · 4:5</span>
          </Photo>
        </Reveal>
        <div className="flex flex-col gap-7">
          <WordHeading text="About me" />
          <ul className="m-0 flex list-none flex-col p-0">
            {aboutBullets.map((b, i) => (
              <Reveal as="li" key={b.t} i={i} className="flex items-baseline gap-3.5 border-t border-white/15 py-4 text-[clamp(17px,1.5vw,20px)] leading-[1.45]">
                <span className="size-[9px] flex-none -translate-y-0.5 rounded-[3px]" style={{ background: b.c }} />
                {b.t}
              </Reveal>
            ))}
          </ul>
          <Reveal i={2} className="flex flex-wrap gap-2">
            {socialChips.map((c) => (
              <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-[18px] py-2.5 text-[15px] transition-colors hover:bg-paper hover:text-navy">
                {c.name} ↗
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
