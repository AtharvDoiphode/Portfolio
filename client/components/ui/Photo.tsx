import type { ReactNode } from "react";
import { img } from "@/lib/media";
import { Placeholder } from "./Placeholder";

/** Shows an uploaded photo as a cover background, or the striped placeholder until one is uploaded. */
export function Photo({
  url, alt, width = 900, a, b, step, className = "", children, position = "center 20%",
}: { url?: string; alt: string; width?: number; a: string; b: string; step?: number; className?: string; children?: ReactNode; position?: string }) {
  if (!url) return <Placeholder a={a} b={b} step={step} className={className}>{children}</Placeholder>;
  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{ backgroundImage: `url("${img(url, width)}")`, backgroundSize: "cover", backgroundPosition: position }}
    />
  );
}
