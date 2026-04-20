# Orbit 🪐

A professional network tracker. Log who you know, tag how you know them, keep them warm with nudges.

## Stack

- **Next.js 14** (App Router, React, TypeScript)
- **Tailwind CSS**
- **Prisma + SQLite** (local file `prisma/dev.db`)

## Features

- Contact management — add, edit, delete
- Relationship tags — `mentor`, `peer`, `collaborator`, `advisor`, `friend`
- Warmth score (1–5)
- Per-relationship nudge windows (configurable in the settings panel)
- Connection logging — `ran into`, `texted`, `emailed`, `phone call`, `met up`
- Notes per contact
- Gmail OAuth integration (stubbed — ready to wire)
- LinkedIn integration (stubbed — ready to wire)
- Hide/show profile panel toggle

## Getting started

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed   # optional — loads 5 sample contacts
npm run dev
```

Open <http://localhost:3000>.

## Wiring up Gmail / LinkedIn OAuth

1. Register OAuth apps with Google Cloud Console and LinkedIn Developer Portal.
2. Set the redirect URIs to `http://localhost:3000/api/auth/{gmail,linkedin}/callback`.
3. Fill in the `*_CLIENT_ID`, `*_CLIENT_SECRET`, `*_REDIRECT_URI` values in `.env`.
4. Replace the `// TODO: exchange code for tokens` block in each `callback/route.ts` with a real token exchange against the provider's token endpoint.
5. Encrypt the resulting token bundle before writing it to `Integration.config`.

Until real credentials are set, the `Connect` button on the settings panel toggles a dev-only "connected" flag so you can style and test UI flows.

## Scripts

| Command             | What                                    |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start the dev server                    |
| `npm run build`     | Build for production                    |
| `npm run start`     | Run the production build                |
| `npm run db:push`   | Sync Prisma schema to SQLite            |
| `npm run db:seed`   | Populate the DB with sample contacts    |

## Deploy

Any platform that supports Next.js + a writable filesystem (Fly.io, Railway, a VPS) will work out of the box. For Vercel, swap SQLite for Postgres/Turso by updating `datasource db` in `prisma/schema.prisma`.
