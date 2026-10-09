# Portfolio API

Express 5 + MongoDB backend for the portfolio site and admin panel.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill it in (see the comments inside).
3. `npm run hash-password` -> paste the result into `.env` as `ADMIN_PASSWORD_HASH`.
4. `npm run seed` -> fills MongoDB with the content currently on the site.
5. `npm run dev` -> API on http://localhost:4000 (check http://localhost:4000/health).
6. In another terminal: `npm run smoke` -> automated check of login, projects and the contact form.

## Scripts
| Script | What it does |
| --- | --- |
| `dev` | start with auto-reload |
| `build` / `start` | compile to `dist/` and run it (what Render uses) |
| `seed` | fill an empty database (`-- --force` to overwrite) |
| `hash-password` | make the admin password hash |
| `smoke` | test a running API (`API_URL=https://... npm run smoke`) |
| `typecheck` | TypeScript check only |

## Endpoints
Public: `GET /health`, `GET /api/site`, `GET /api/resume`, `POST /api/contact` (5 per hour per IP + honeypot).
Auth: `POST /api/auth/login` (10 tries / 15 min), `POST /api/auth/logout`, `GET /api/auth/me`.
Admin (cookie required, plus header `x-requested-with: portfolio-admin` on writes):
`/api/admin/overview`, `/projects` (+ `PUT /projects/reorder`), `/settings`, `/messages`, `/resume` (PUT a PDF, max 4 MB), `POST /uploads/sign`.

## Deploy on Render (free)
- New Web Service -> connect the GitHub repo.
- Build command: `npm install && npm run build` - Start command: `npm start`
- Add every variable from `.env.example` in Render's Environment tab (`NODE_ENV=production`, `FRONTEND_URL` = your Vercel URL).
- Free services sleep after 15 min idle; the first request takes ~30s. The website is built to keep working while the API wakes up.
