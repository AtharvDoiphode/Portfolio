/** @type {import('next').NextConfig} */
const api = process.env.API_URL?.replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      // beforeFiles: these win over anything in /public.
      beforeFiles: [
        // /resume.pdf serves the PDF uploaded in the admin (app/resume-pdf/route.ts), with a bundled fallback.
        { source: "/resume.pdf", destination: "/resume-pdf" },
        // Same-origin proxy: the browser only talks to this site, so the admin login cookie is first-party.
        ...(api ? [{ source: "/api/:path*", destination: `${api}/api/:path*` }] : []),
      ],
    };
  },
  async headers() {
    return [{ source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
