"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "framer-motion";
import { introText } from "@/lib/data";
import { useSite } from "@/components/SiteContext";
import { Reveal } from "@/components/motion/Reveal";
import { useTypeOnce } from "@/components/motion/hooks";
import { Photo } from "@/components/ui/Photo";

export function Intro() {
  const { profile, resumeHref } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const typed = useTypeOnce(introText, inView);

  return (
    <section data-screen-label="02 Intro" className="sec z-[2] bg-blush text-navy">
      <div className="wrap grid items-center gap-[clamp(40px,6vw,96px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]">
        {/* photo collage: portrait (from /admin, or the bundled default), laptop and phone mockups */}
        <Reveal className="relative aspect-[5/4] w-full max-w-[620px]">
          <Photo url={profile.introPhotoUrl} alt="Atharv Doiphode in a tan blazer, sitting with a tablet" position="50% 30%" a="#DDBFD1" b="#E6C9DA" step={10} className="absolute top-0 left-0 flex h-full w-[68%] items-end rounded-[28px] p-4 font-mono text-xs text-mute-l">
            photo of Atharv · portrait
          </Photo>
          <div className="absolute right-0 bottom-[8%] aspect-[16/11] w-[52%] rounded-2xl bg-navy p-2 shadow-[0_30px_60px_-30px_rgba(20,17,43,.6)]">
            <div className="relative size-full overflow-hidden rounded-[10px] bg-navy-2">
              <Image src="/images/intro-laptop.png" alt="CutPro salon booking site on a laptop" fill sizes="(min-width: 1024px) 330px, 50vw" className="object-cover object-top" />
            </div>
          </div>
          <div className="absolute right-[42%] -bottom-[4%] aspect-[9/18] w-1/5 rounded-[18px] bg-navy p-[5px] shadow-[0_20px_40px_-20px_rgba(20,17,43,.6)]">
            <div className="relative size-full overflow-hidden rounded-[14px] bg-navy-2">
              <Image src="/images/intro-phone.png" alt="ProductMotion AI app screen on a phone" fill sizes="(min-width: 1024px) 130px, 20vw" className="object-cover object-top" />
            </div>
          </div>
        </Reveal>

        <div ref={ref} className="flex flex-col gap-7">
          <Reveal className="mono-label text-mute-l">HELLO — I&apos;M ATHARV</Reveal>
          <h1
            aria-label={introText}
            className="m-0 grid text-balance font-display text-[clamp(48px,6.4vw,104px)] font-extrabold leading-[0.92] tracking-[-0.04em]"
          >
            <span aria-hidden="true" className="invisible [grid-area:1/1]">{introText}</span>
            <span aria-hidden="true" className="[grid-area:1/1]">
              {typed}
              <span className="ml-[0.04em] inline-block h-[0.8em] w-[0.08em] bg-ultra align-[-0.05em]" />
            </span>
          </h1>
          <Reveal as="p" i={1} className="m-0 max-w-[520px] text-pretty text-[clamp(17px,1.4vw,20px)] leading-[1.55] text-ink-2">
            I&apos;m a full-stack developer, AI video creator and UI/UX designer from Pune, India. I build websites for local businesses, make AI videos for brands, and set up the dashboards and Instagram pages that help small teams run.
          </Reveal>
          <Reveal i={2} className="flex flex-wrap gap-3">
            <Link href="/#work" className="btn bg-navy text-paper hover:bg-ultra">See my work →</Link>
            <a href={resumeHref} download className="btn border-[1.5px] border-navy hover:bg-navy hover:text-paper">Download résumé ↓</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
