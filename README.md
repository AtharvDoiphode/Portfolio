# Atharv Doiphode: portfolio

| Folder | What | Deploys to |
|---|---|---|
| `client/` | Next.js site + `/admin` panel | Vercel, Root Directory `client` |
| `server/` | Express + MongoDB API (auth, projects, messages, uploads) | Render, Root Directory `server` |

Run locally: start the API first (`server/README.md`), then the site (`client/README.md`).
Secrets live in `server/.env` and `client/.env.local`, which are never committed; copy them from the `.env.example` files.
