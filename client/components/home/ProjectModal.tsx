"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { covers, type Project } from "@/lib/data";
import { Placeholder } from "@/components/ui/Placeholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { img, videoPoster } from "@/lib/media";

/** Project details dialog. Esc, the close button or the backdrop closes it; Tab stays inside. */
export function ProjectModal({
  project, pos, total, onClose, onStep,
}: { project: Project; pos: number; total: number; onClose: () => void; onStep: (d: number) => void }) {
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = dialog.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  const [primary, secondary] = project.links;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,8,24,.72)] p-[clamp(12px,3vw,40px)] backdrop-blur-[6px]"
    >
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 24, scale: 0.98, opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className="grid max-h-[calc(100vh-32px)] w-full max-w-[980px] gap-[clamp(20px,3vw,36px)] overflow-auto rounded-[28px] bg-paper p-[clamp(14px,2vw,20px)] text-navy [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]"
      >
        <div className="flex flex-col gap-2.5">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              poster={project.coverUrl ? img(project.coverUrl, 1000) : videoPoster(project.videoUrl, 1000) || undefined}
              controls
              playsInline
              preload="metadata"
              className="aspect-[4/3] w-full rounded-[20px] bg-navy object-contain"
            />
          ) : (
            <div
              className="flex aspect-[4/3] items-end rounded-[20px] p-3.5 font-mono text-xs text-mute-l"
              style={project.coverUrl ? { backgroundImage: `url("${img(project.coverUrl, 1000)}")`, backgroundSize: "cover", backgroundPosition: project.coverPos ?? "center" } : { background: covers[project.cat] }}
            >
              {!project.coverUrl && project.ph}
            </div>
          )}
          {!project.coverUrl && !project.videoUrl && (
            <div className="grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <Placeholder key={i} a="#E6DDE6" b="#EFE8EE" className="aspect-square rounded-[14px]" />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[18px] py-[clamp(4px,1.5vw,16px)] pr-[clamp(4px,1.5vw,16px)] pb-2 pl-0">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-blush px-3.5 py-[7px] text-[13px] font-medium">{project.cat}</span>
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className="size-11 rounded-full bg-navy text-lg text-paper transition-colors hover:bg-ultra">
              ✕
            </button>
          </div>
          <h2 className="m-0 font-display text-[clamp(36px,4vw,56px)] font-extrabold leading-[0.95] tracking-[-0.035em]">{project.title}</h2>
          <p className="m-0 text-[17px] leading-[1.55] text-ink-2">{project.long}</p>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-mute-l">BUILT WITH / FORMAT</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full border border-[#E3D6DF] bg-white px-[11px] py-1.5 font-mono text-xs">{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-auto flex flex-wrap gap-2.5">
            {primary && (
              <SmartLink href={primary.href} className="btn bg-ultra text-white hover:bg-ultra-hi">
                {primary.label} {/^https?:/.test(primary.href) ? "↗" : "→"}
              </SmartLink>
            )}
            {secondary && (
              <SmartLink href={secondary.href} className="btn border-[1.5px] border-navy hover:bg-navy hover:text-paper">
                {secondary.label}
              </SmartLink>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#E3D6DF] pt-3.5">
            <button type="button" onClick={() => onStep(-1)} className="min-h-11 px-1 text-sm text-mute-l hover:text-navy">← Previous</button>
            <span className="font-mono text-xs text-mute-l">{pos + 1} / {total}</span>
            <button type="button" onClick={() => onStep(1)} className="min-h-11 px-1 text-sm text-mute-l hover:text-navy">Next →</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
