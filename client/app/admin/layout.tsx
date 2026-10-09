import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · atharv*",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F6F1F4] font-sans text-navy">{children}</div>;
}
