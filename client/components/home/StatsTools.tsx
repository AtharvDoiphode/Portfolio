"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { toolDots, tools } from "@/lib/data";
import { useSite } from "@/components/SiteContext";
import { Reveal } from "@/components/motion/Reveal";
import { useCountUp } from "@/components/motion/hooks";

export function StatsTools() {
  const { stats } = useSite();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const p = useCountUp(inView);
  const loop = [...tools, ...tools];

  return (
    <section ref={ref} data-screen-label="04 Stats" className="sec z-[4] overflow-x-clip bg-blush pt-[clamp(72px,9vw,128px)] pb-[clamp(56px,6vw,88px)] text-navy" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="wrap grid gap-[clamp(28px,3vw,40px)] px-[clamp(20px,5vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        {stats.map((s, i) => (
          <Reveal key={s.label} i={i} className="flex flex-col gap-2.5 border-t-2 border-navy pt-[18px]">
            <span className="font-display text-[clamp(72px,8.6vw,136px)] font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums">
              {(s.to * p).toFixed(s.decimals)}
              {s.suffix}
            </span>
            <span className="max-w-[260px] text-base leading-[1.35] text-ink-2">{s.label}</span>
          </Reveal>
        ))}
      </div>

      {/* tools marquee: duplicated list, x 0 to -50%, tilted -1.2deg, pauses on hover */}
      <div
        aria-label="Tools I use"
        className="group mt-[clamp(56px,7vw,96px)] -rotate-[1.2deg] scale-[1.02] overflow-hidden bg-navy py-[22px] text-paper"
      >
        <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
          {loop.map((name, i) => (
            <span key={i} className="flex items-center gap-7 pr-7 font-display text-[clamp(22px,2.4vw,34px)] font-semibold tracking-[-0.02em] whitespace-nowrap">
              {name}
              <span className="size-2.5 rounded-full" style={{ background: toolDots[i % 4] }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
