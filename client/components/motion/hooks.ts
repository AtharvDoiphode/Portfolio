"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/** The one shared ease for reveals (Design Spec, section 04). */
export const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Hero prompt line: cycles through phrases, types 40-100ms/char, holds 2s, deletes at 22ms. */
export function useTypeCycle(phrases: string[]) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduce) {
      setTyped(phrases[0]);
      return;
    }
    let pi = 0, ci = 0, dir = 1;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const ph = phrases[pi];
      setTyped(ph.slice(0, ci));
      let d: number;
      if (dir > 0) {
        if (ci < ph.length) { ci++; d = 40 + Math.random() * 60; }
        else { dir = -1; d = 2000; }
      } else if (ci > 0) { ci--; d = 22; }
      else { pi = (pi + 1) % phrases.length; dir = 1; d = 350; }
      t = setTimeout(tick, d);
    };
    tick();
    return () => clearTimeout(t);
  }, [reduce, phrases]);

  return typed;
}

/** Intro headline: types once when `active` turns true. */
export function useTypeOnce(text: string, active: boolean) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) { setN(text.length); return; }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setN(i);
      if (i < text.length) { i++; t = setTimeout(tick, 55 + Math.random() * 40); }
    };
    tick();
    return () => clearTimeout(t);
  }, [active, reduce, text]);

  return text.slice(0, n);
}

/** Stats: progress 0 to 1 over 1600ms, ease-out cubic, starts when `active` turns true. */
export function useCountUp(active: boolean) {
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) { setP(1); return; }
    const c = animate(0, 1, { duration: 1.6, ease: [0.33, 1, 0.68, 1], onUpdate: setP });
    return () => c.stop();
  }, [active, reduce]);

  return p;
}
