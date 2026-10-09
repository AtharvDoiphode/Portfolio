"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categories, type Category } from "@/lib/data";
import { useSite } from "@/components/SiteContext";
import { WordHeading } from "@/components/motion/Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

const PAD = "max(clamp(20px,5vw,72px),calc((100% - 1280px)/2 + 72px))";

export function Work() {
  const reduce = useReducedMotion();
  const { projects } = useSite();
  const [tab, setTab] = useState<Category>(() => categories.find((c) => projects.some((p) => p.cat === c)) ?? "Websites");
  const [openId, setOpenId] = useState<string | null>(null);
  const car = useRef<HTMLDivElement>(null);

  const shown = projects.filter((p) => p.cat === tab);
  const active = openId ? projects.find((p) => p.id === openId) ?? null : null;
  const sameCat = active ? projects.filter((p) => p.cat === active.cat) : [];
  const pos = active ? sameCat.findIndex((p) => p.id === active.id) : 0;

  const step = (d: number) => setOpenId(sameCat[(pos + d + sameCat.length) % sameCat.length].id);
  const close = useCallback(() => setOpenId(null), []);
  const scrollBy = (left: number) => car.current?.scrollBy({ left, behavior: reduce ? "auto" : "smooth" });

  return (
    <>
    <section id="work" data-screen-label="05 Selected work" className="relative z-[5] -mt-px scroll-mt-5 bg-lilac py-[clamp(72px,9vw,128px)] text-navy">
      <div className="wrap px-[clamp(20px,5vw,72px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <WordHeading text="Selected work" />
          <div className="flex gap-2">
            <button type="button" onClick={() => scrollBy(-420)} aria-label="Previous projects" className="size-[52px] rounded-full border-[1.5px] border-navy bg-transparent text-lg transition-colors hover:bg-navy hover:text-paper">←</button>
            <button type="button" onClick={() => scrollBy(420)} aria-label="Next projects" className="size-[52px] rounded-full bg-navy text-lg text-paper transition-colors hover:bg-ultra">→</button>
          </div>
        </div>

        <div role="tablist" aria-label="Project category" className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = tab === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(c)}
                className={`flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-navy px-5 py-2.5 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ${on ? "bg-navy text-paper" : "bg-transparent text-navy"}`}
              >
                {c}
                <span className="font-mono text-xs opacity-70">{projects.filter((p) => p.cat === c).length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          ref={car}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pt-3 pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingLeft: PAD, paddingRight: PAD, scrollPaddingLeft: PAD }}
        >
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => setOpenId(p.id)} />
          ))}
          {shown.length === 0 && <p className="m-0 py-10 text-lg text-mute-l">New work in this category is on its way.</p>}
        </motion.div>
      </AnimatePresence>

    </section>

    {/* Rendered outside the section so its fixed overlay isn't trapped in the section's stacking context. */}
    <AnimatePresence>
      {active && <ProjectModal key="modal" project={active} pos={pos} total={sameCat.length} onClose={close} onStep={step} />}
    </AnimatePresence>
    </>
  );
}
