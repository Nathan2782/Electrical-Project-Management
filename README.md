# Voltline — Electrical Project Workspace

A Slack-style project workspace built for electrical contractors, foremen, journeymen, apprentices, and crews. Work is organized around **Projects**, not individual conversations. Each project has a team conversation plus Prints, Notes & Materials, Tasks, Photos, Documents, and field tools.

## Stack

- **Next.js 16** App Router + TypeScript
- **Tailwind CSS v4**
- **Prisma + PostgreSQL** for persistence
- Vercel-ready production build
- No authentication system in this demo. The seeded Foreman account is used as the current session.

## Local development

```bash
npm ci
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Vercel deployment

1. Import this repository into Vercel.
2. Keep the framework as **Next.js**.
3. Add a hosted PostgreSQL database and set `DATABASE_URL` in the Vercel project environment variables for **Production**, **Preview**, and **Development** as needed.
4. Deploy. The repository includes `vercel.json` with the Next.js install and build commands.

The production build runs `prisma generate && next build`. Do not use SQLite in Vercel serverless production because the filesystem is ephemeral. Use PostgreSQL through `DATABASE_URL` as defined by `prisma/schema.prisma`.

## Useful scripts

- `npm run db:push` — apply the Prisma schema
- `npm run db:seed` — seed the demo workspace
- `npm run db:reset` — wipe and reseed the database
- `npm run build` — production build
- `npm run lint` — ESLint

## Project structure

- `src/app/(app)/` — workspace routes and project pages
- `src/components/` — shell, sidebar, conversation, forms, and project UI
- `src/lib/` — Prisma client, session/role helpers, navigation, status, and search
- `prisma/` — PostgreSQL schema and seed data
