import { NextResponse } from "next/server";

/** /resume.pdf (rewritten to this route in next.config.mjs) serves the PDF uploaded in the admin; falls back to the bundled copy if none exists or the API is asleep. */
export async function GET(req: Request) {
  const api = process.env.API_URL?.replace(/\/$/, "");
  if (api) {
    try {
      const res = await fetch(`${api}/api/resume`, { next: { revalidate: 60, tags: ["site"] }, signal: AbortSignal.timeout(9000) });
      if (res.ok) {
        return new NextResponse(await res.arrayBuffer(), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="Atharv_Doiphode_Resume.pdf"',
            "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
          },
        });
      }
    } catch {
      /* fall through to the bundled copy */
    }
  }
  return NextResponse.redirect(new URL("/resume-fallback.pdf", req.url), 307);
}
