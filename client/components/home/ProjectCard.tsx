"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { covers, type Project } from "@/lib/data";
import { img } from "@/lib/media";

/** Card with hover tilt: rotateX/Y up to 7deg / 9deg, lift 6px, perspective 900. */
export function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const spring = { stiffness: 220, damping: 22 };
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const lift = useSpring(0, spring);
  const scale = useSpring(1, spring);

  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-y * 7); ry.set(x * 9); lift.set(-6); scale.set(1.01);
  };
  const leave = () => { rx.set(0); ry.set(0); lift.set(0); scale.set(1); };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: Math.min(index, 6) * 0.09 }}
      className="w-[min(400px,82vw)] flex-none snap-start"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={move}
        onPointerLeave={leave}
        aria-label={`${project.title}, ${project.cat}. Open details.`}
        style={{ rotateX: rx, rotateY: ry, y: lift, scale, transformPerspective: 900 }}
        className="block w-full rounded-3xl bg-white p-3 text-left text-navy shadow-[0_1px_0_rgba(20,17,43,.08)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(20,17,43,.45)] focus-visible:outline-offset-4"
      >
        <div
          className="flex aspect-[4/3] flex-col justify-between rounded-2xl p-3.5"
          style={project.coverUrl ? { backgroundImage: `url("${img(project.coverUrl, 800)}")`, backgroundSize: "cover", backgroundPosition: project.coverPos ?? "center" } : { background: covers[project.cat] }}
        >
          <span className="self-start rounded-full bg-paper px-3 py-1.5 text-xs font-medium">{project.cat}</span>
          {!project.coverUrl && <span className="font-mono text-[11px] text-mute-l">{project.ph}</span>}
        </div>
        <div className="flex flex-col gap-2 px-2 pt-[18px] pb-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-display text-[26px] font-extrabold leading-none tracking-[-0.025em]">{project.title}</span>
            <span aria-hidden="true" className="text-lg">↗</span>
          </div>
          <span className="min-h-11 text-[15px] leading-[1.45] text-mute-l">{project.desc}</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full bg-[#F1E6EC] px-[9px] py-[5px] font-mono text-[11px]">{t}</span>
            ))}
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
