# Atharv Doiphode: portfolio site + admin

Next.js 15 (App Router) · React 19 · Tailwind v4 · Framer Motion. The public site reads its content from the API (`server` folder) and falls back to `lib/data.ts` if the API is asleep, so visitors never see an error.

## Run locally
1. Start the API first (see `server/README.md`), so it listens on http://localhost:4000.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill it in.
4. `npm run dev` -> http://localhost:3000 (admin at http://localhost:3000/admin)

## How it fits together
- `/api/*` is proxied to the API (`next.config.mjs`), so the admin login cookie stays on your own domain.
- Edits in `/admin` call `/internal/revalidate`, so the public site updates within seconds (it also refreshes itself every 60 s).
- `/resume.pdf` serves the PDF uploaded in the admin; `public/resume-fallback.pdf` is used if none exists.
- `/admin/*` is hidden from search engines and gated by a login cookie (verified by the API on every request).

## Deploy on Vercel
Import the GitHub repo, then add these Environment Variables: `API_URL` (your Render URL), `REVALIDATE_SECRET`, `NEXT_PUBLIC_SITE_URL` (your Vercel URL). Deploy.
