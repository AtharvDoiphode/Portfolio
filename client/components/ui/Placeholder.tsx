import type { CSSProperties, ReactNode } from "react";

/** Striped stand-in for photos and screenshots until real media is uploaded from /admin. */
export function Placeholder({
  a, b, step = 9, className = "", style, children,
}: { a: string; b: string; step?: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      className={className}
      style={{ background: `repeating-linear-gradient(135deg,${a} 0 1px,${b} 1px ${step}px)`, ...style }}
    >
      {children}
    </div>
  );
}
