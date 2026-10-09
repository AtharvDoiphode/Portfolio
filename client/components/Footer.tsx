import Link from "next/link";
import { socialFrom, type SiteData } from "@/lib/site";

const pages = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ site }: { site: SiteData }) {
  const footIcons = socialFrom(site.links);
  const { email, name } = site.profile;
  return (
    <footer data-screen-label="11 Footer" className="sec on-dark z-[11] bg-navy text-paper" style={{ paddingTop: "clamp(48px,6vw,72px)", paddingBottom: 32 }}>
      <div className="wrap flex flex-col gap-12">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="font-display text-[clamp(48px,7.5vw,120px)] font-extrabold leading-[0.85] tracking-[-0.05em]">
            Atharv<br />Doiphode
          </div>
          <div className="flex flex-wrap gap-[clamp(32px,5vw,72px)]">
            <div className="flex flex-col gap-0.5">
              <span className="mb-2 font-mono text-xs text-mute-d">PAGES</span>
              {pages.map((p) => (
                <Link key={p.label} href={p.href} className="flex min-h-10 items-center py-2 text-base transition-colors hover:text-ultra-soft">
                  {p.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs text-mute-d">ELSEWHERE</span>
              <div className="flex gap-2">
                {footIcons.map((f) => (
                  <a key={f.label} href={f.href} target="_blank" rel="noopener noreferrer" aria-label={f.label} className="grid size-12 place-items-center rounded-full border border-white/20 font-mono text-[13px] transition-colors hover:bg-paper hover:text-navy">
                    {f.g}
                  </a>
                ))}
              </div>
              <a href={`mailto:${email}`} className="mt-1.5 text-[15px] text-mist transition-colors hover:text-ultra-soft">{email}</a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 font-mono text-xs text-mute-d">
          <span>© 2026 {name}</span>
          <span>Designed &amp; built in Pune</span>
        </div>
      </div>
    </footer>
  );
}
