import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Chrome } from "@/components/Chrome";
import { SiteProvider } from "@/components/SiteContext";
import { getSite } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Atharv Doiphode · Full-stack developer & AI video creator",
  description:
    "Full-stack developer, AI video creator and UI/UX designer from Pune, India. Websites for local businesses, AI videos for brands, Excel dashboards and Instagram setup.",
  openGraph: {
    title: "Atharv Doiphode · Full-stack developer & AI video creator",
    description: "I build things people actually use.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#14112B" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="en">
      <body>
        <SiteProvider site={site}>
          <Chrome nav={<Nav />} footer={<Footer site={site} />}>
            {children}
          </Chrome>
        </SiteProvider>
      </body>
    </html>
  );
}
