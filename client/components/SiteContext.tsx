"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/site";

const Ctx = createContext<SiteData | null>(null);

export function SiteProvider({ site, children }: { site: SiteData; children: React.ReactNode }) {
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}

export function useSite(): SiteData {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used inside <SiteProvider>");
  return v;
}
