"use client";

import { Fragment, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "./hooks";

const tags = {
  div: motion.div,
  li: motion.li,
  a: motion.a,
  p: motion.p,
  span: motion.span,
  h3: motion.h3,
} as const;

type Tag = keyof typeof tags;

type RevealProps = {
  /** Stagger index; delay is index x 90ms, capped at 6 steps. */
  i?: number;
  as?: Tag;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "children"> & { href?: string; target?: string; rel?: string };

/** Global reveal: opacity 0 to 1, y 28 to 0, once, 700ms. Plain element under reduced motion. */
export function Reveal({ i = 0, as = "div", children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as] as typeof motion.div;
  if (reduce) {
    const Plain = as as "div";
    return <Plain {...rest}>{children}</Plain>;
  }
  return (
    <Tag
      {...(rest as object)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 6) * 0.09 }}
    >
      {children}
    </Tag>
  );
}

/** Section headings: each word rises from 100% inside an overflow-hidden line. 600ms, 60ms per word. */
export function WordHeading({
  text,
  as: Tag = "h2",
  className = "h2",
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Observe the heading itself: the words are clipped by their own overflow-hidden lines while hidden,
  // so observing them directly would never report them as visible.
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const lines = text.split("\n");
  let w = 0;
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(" ").map((word) => {
            const idx = w++;
            return (
              <Fragment key={idx}>
                <span aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                  {reduce ? (
                    <span className="inline-block">{word}</span>
                  ) : (
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: inView ? 0 : "110%" }}
                      transition={{ duration: 0.6, ease: EASE, delay: idx * 0.06 }}
                    >
                      {word}
                    </motion.span>
                  )}
                </span>{" "}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}
