"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The public nav and footer wrap every page except the admin panel. */
export function Chrome({ nav, footer, children }: { nav: ReactNode; footer: ReactNode; children: ReactNode }) {
  const inAdmin = usePathname().startsWith("/admin");
  if (inAdmin) return <>{children}</>;
  return (
    <>
      {nav}
      {children}
      {footer}
    </>
  );
}
