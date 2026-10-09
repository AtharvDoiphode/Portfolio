"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useAnimate, useReducedMotion, type MotionValue } from "framer-motion";
import { barcode } from "@/lib/data";
import { useSite } from "@/components/SiteContext";
import { Photo } from "@/components/ui/Photo";

/**
 * Lanyard ID badge. Drops in with a spring swing (from 11deg, stiffness 60, damping 6),
 * then sways +-1.4deg on a 7s loop. Flips on hover (mouse), tap (touch) or Enter/Space,
 * and each flip re-triggers a small swing.
 */
export function LanyardBadge({ driftX, driftY }: { driftX?: MotionValue<number>; driftY?: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const { profile, services } = useSite();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [flipped, setFlipped] = useState(false);
  const pointerType = useRef("");
  const ctl = useRef<{ stop: () => void } | null>(null);
  const token = useRef(0);

  const swing = useCallback(
    async (strength = 1) => {
      if (reduce || !scope.current) return;
      ctl.current?.stop();
      const id = ++token.current;
      const drop = animate(scope.current, { rotate: [11 * strength, 0] }, { type: "spring", stiffness: 60, damping: 6 });
      ctl.current = drop;
      await drop;
      if (id !== token.current || !scope.current) return; // a newer swing took over
      ctl.current = animate(scope.current, { rotate: [0, 1.4, 0, -1.4, 0] }, { duration: 7, repeat: Infinity, ease: "easeInOut" });
    },
    [reduce, animate, scope],
  );

  useEffect(() => {
    swing(1);
    return () => {
      token.current++;
      ctl.current?.stop();
    };
  }, [swing]);

  const flip = () => {
    setFlipped((f) => !f);
    swing(0.45);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  };
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && !flipped) flip();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && flipped) flip();
  };

  return (
    <motion.div style={{ x: driftX, y: driftY }}>
      <div ref={scope} style={{ transformOrigin: "50% 0" }} className="flex flex-col items-center">
        {/* strap */}
        <div className="flex h-[120px] w-[34px] justify-center overflow-hidden bg-ultra shadow-[inset_-8px_0_0_rgba(0,0,0,.12)] md:h-[clamp(110px,20vh,210px)] md:w-10">
          <span className="whitespace-nowrap pt-2 font-mono text-[10px] tracking-[0.3em] text-white [writing-mode:vertical-rl] md:text-[11px]">
            ATHARV DOIPHODE · ATHARV DOIPHODE · ATHARV DOIPHODE
          </span>
        </div>
        {/* clip */}
        <div className="relative z-[2] -mt-0.5 h-[22px] w-[50px] rounded-[7px] border-2 border-[#A79FBC] bg-[#CFC8DD] md:h-[26px] md:w-[58px] md:rounded-lg" />

        {/* card */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label="ID badge. Press to flip and see what I do."
          onPointerDown={(e) => (pointerType.current = e.pointerType)}
          onClick={(e) => {
            if (pointerType.current === "mouse" && e.detail > 0) return; // hover already handles mouse
            flip();
          }}
          onKeyDown={onKey}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          className="-mt-2.5 h-[340px] w-[240px] cursor-pointer rounded-[22px] outline-offset-[6px] [perspective:1400px] md:-mt-3 md:h-[420px] md:w-[290px] md:rounded-3xl"
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 12 }}
          >
            {/* front */}
            <div className="backface-hidden absolute inset-0 flex flex-col gap-2.5 rounded-[22px] bg-paper p-[22px_14px_14px] text-navy shadow-[0_30px_60px_-24px_rgba(0,0,0,.7)] md:gap-3 md:rounded-3xl md:p-[26px_18px_18px] md:shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
              <div className="absolute top-2.5 left-1/2 hidden h-2 w-[54px] -translate-x-1/2 rounded-full bg-navy/85 md:block" />
              <div className="flex items-center justify-between font-mono text-[10px] text-mute-l md:text-[11px]">
                <span className="font-display text-sm font-extrabold text-navy md:text-base">Atharv Doiphode</span>
                <span>ID · 2026</span>
              </div>
              <Photo url={profile.photoUrl} alt="Atharv Doiphode, headshot" width={640} position="50% 25%" a="#E6DDE6" b="#EFE8EE" className="flex flex-1 items-end rounded-[14px] p-2 font-mono text-[10px] text-[#6B6485] md:rounded-2xl md:p-2.5 md:text-[11px]">
                photo · 3:4
              </Photo>
              <div>
                <div className="font-display text-[23px] font-extrabold leading-[0.95] tracking-[-0.03em] md:text-[28px]">
                  Atharv<br className="hidden md:block" /> Doiphode
                </div>
                <div className="mt-1.5 text-xs text-mute-l md:text-[13px]">Full-stack developer · Pune, IN</div>
              </div>
              <div className="hidden items-end justify-between gap-2.5 md:flex">
                <div className="flex h-[30px] items-stretch gap-0.5" aria-hidden="true">
                  {barcode.map((w, i) => (
                    <span key={i} className="block bg-navy" style={{ width: w }} />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-mute-l">flip ↻</span>
              </div>
            </div>

            {/* back */}
            <div className="backface-hidden absolute inset-0 flex [transform:rotateY(180deg)] flex-col gap-2 rounded-[22px] bg-blush p-[22px_14px_14px] text-navy md:gap-3 md:rounded-3xl md:p-[26px_18px_18px] md:shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
              <div className="absolute top-2.5 left-1/2 hidden h-2 w-[54px] -translate-x-1/2 rounded-full bg-navy/85 md:block" />
              <div className="hidden font-mono text-[11px] text-mute-l md:block">BACK · SIDE B</div>
              <div className="font-display text-2xl font-extrabold leading-none tracking-[-0.03em] md:text-[30px]">What I do</div>
              <div className="flex flex-1 flex-col gap-2">
                {services.map((s) => (
                  <div key={s.n} className="flex items-center gap-2 rounded-[10px] bg-white/55 p-2 md:gap-2.5 md:rounded-xl md:px-2.5 md:py-[9px]">
                    <span className="grid size-6 flex-none place-items-center rounded-[7px] font-mono text-[10px] md:size-7 md:rounded-lg md:text-[11px] md:font-medium" style={{ background: s.chip }}>
                      {s.glyph}
                    </span>
                    <span className="text-xs font-medium leading-tight md:text-[13px]">{s.short}</span>
                  </div>
                ))}
              </div>
              <div className="hidden justify-between font-mono text-[10px] text-mute-l md:flex">
                <span>{profile.email}</span>
                <span>↻</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
