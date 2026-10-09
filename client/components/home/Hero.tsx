"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { heroPhrases, roles } from "@/lib/data";
import { useTypeCycle } from "@/components/motion/hooks";
import { LanyardBadge } from "./LanyardBadge";

const SIDE = "clamp(24px,4vw,64px)";

function RoleWord({
  role, factor, sx, sy, className, align,
}: {
  role: (typeof roles)[number];
  factor: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  className: string;
  align: "left" | "right";
}) {
  const x = useTransform(sx, (v) => v * factor * 2);
  const y = useTransform(sy, (v) => v * factor * 2);
  const right = align === "right";
  return (
    <motion.div style={{ x, y }} className={`absolute hidden md:block ${className} ${right ? "text-right" : ""}`}>
      <div className={`mb-2.5 flex items-center gap-2 font-mono text-[13px] text-mute-d ${right ? "justify-end" : ""}`}>
        {!right && <span className="size-2.5 rounded-[3px]" style={{ background: role.chip }} />}
        {role.n}
        {right && <span className="size-2.5 rounded-[3px]" style={{ background: role.chip }} />}
      </div>
      <div className="font-display text-[clamp(44px,5.6vw,92px)] font-extrabold leading-[0.88] tracking-[-0.035em]">
        {role.lines.map((l, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {l}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypeCycle(heroPhrases);
  // Pointer position (-0.5..0.5) smoothed by a spring; each role word and the badge drift against it.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const badgeX = useTransform(sx, (v) => v * -16 * 2);
  const badgeY = useTransform(sy, (v) => v * -16 * 2);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || window.innerWidth < 760) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section data-screen-label="01 Hero" onMouseMove={onMove} className="on-dark relative z-[1] overflow-hidden bg-navy text-paper">
      <div className="relative px-5 pb-9 md:h-[max(100vh,780px)] md:px-[clamp(24px,4vw,64px)] md:pb-0">
        {/* corner role words (desktop) */}
        <RoleWord role={roles[0]} factor={10} sx={sx} sy={sy} align="left" className="top-32 left-[clamp(24px,4vw,64px)]" />
        <RoleWord role={roles[1]} factor={-12} sx={sx} sy={sy} align="right" className="top-32 right-[clamp(24px,4vw,64px)]" />
        <RoleWord role={roles[2]} factor={-9} sx={sx} sy={sy} align="left" className="bottom-[130px] left-[clamp(24px,4vw,64px)]" />
        <RoleWord role={roles[3]} factor={13} sx={sx} sy={sy} align="right" className="bottom-[130px] right-[clamp(24px,4vw,64px)]" />

        {/* typed prompt + hint (desktop) */}
        <div className="absolute bottom-11 hidden items-center gap-2.5 font-mono text-sm text-mist md:flex" style={{ left: SIDE }} aria-live="polite">
          <span className="text-ultra-soft">~/atharv $</span>
          <span>{typed}</span>
          <span className="h-[17px] w-2 bg-ultra-soft" />
        </div>
        <div className="absolute bottom-11 hidden font-mono text-[13px] text-mute-d md:block" style={{ right: SIDE }}>
          Pune, India · scroll ↓
        </div>

        {/* badge */}
        <div className="relative z-[2] flex justify-center md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2">
          <LanyardBadge driftX={badgeX} driftY={badgeY} />
        </div>

        {/* roles + prompt (mobile) */}
        <div className="mt-9 flex flex-col gap-3.5 md:hidden">
          {roles.map((r) => (
            <div key={r.n} className="flex items-baseline gap-3 border-t border-white/10 pt-3">
              <span className="flex items-center gap-1.5 font-mono text-xs text-mute-d">
                <span className="size-2 rounded-[2px]" style={{ background: r.chip }} />
                {r.n}
              </span>
              <span className="font-display text-[40px] font-extrabold leading-[0.9] tracking-[-0.035em]">{r.word}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 min-h-10 font-mono text-[13px] text-mist md:hidden" aria-live="polite">
          <span className="text-ultra-soft">~/atharv $ </span>
          {typed}
          <span className="ml-[3px] inline-block h-[15px] w-[7px] bg-ultra-soft align-[-2px]" />
        </div>
      </div>
    </section>
  );
}
