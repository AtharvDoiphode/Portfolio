"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { useSite } from "@/components/SiteContext";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
];

export function Nav() {
  const reduce = useReducedMotion();
  const { profile } = useSite();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  // Lock page scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <motion.nav
        aria-label="Main"
        initial={false}
        animate={{ maxWidth: scrolled ? 720 : 1180, paddingTop: scrolled ? 6 : 10, paddingBottom: scrolled ? 6 : 10, paddingRight: scrolled ? 6 : 10, paddingLeft: scrolled ? 18 : 24 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="on-dark fixed top-4 left-1/2 z-50 flex w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-navy/80 text-paper backdrop-blur-[14px]"
      >
        <Link
          href="/"
          onClick={() => setMenu(false)}
          aria-label="Atharv Doiphode, home"
          className="rounded-lg px-1 py-1.5 font-display text-[19px] font-extrabold tracking-[-0.03em] whitespace-nowrap md:text-[21px]"
        >
          Atharv Doiphode
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="flex min-h-11 items-center rounded-full px-4 text-[15px] text-[#E2DDEE] transition-colors hover:bg-white/10">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="ml-2 flex min-h-11 items-center gap-2 rounded-full bg-ultra px-[22px] text-[15px] font-medium text-white transition-colors hover:bg-ultra-hi">
            Contact <span aria-hidden="true">→</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-label="Menu"
          className="h-11 min-w-11 rounded-full bg-ultra px-[18px] text-[15px] font-medium text-white md:hidden"
        >
          {menu ? "Close" : "Menu"}
        </button>
      </motion.nav>

      {menu && (
        <div className="on-dark fixed inset-0 z-[45] flex flex-col gap-1.5 bg-navy px-6 pt-[110px] pb-8 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="border-b border-white/10 py-[18px] font-display text-[44px] font-extrabold tracking-[-0.03em]">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMenu(false)} className="py-[18px] font-display text-[44px] font-extrabold tracking-[-0.03em] text-ultra-soft">
            Contact →
          </Link>
          <a href={`mailto:${profile.email}`} className="mt-auto font-mono text-sm text-mute-d">
            {profile.email}
          </a>
        </div>
      )}
    </>
  );
}
