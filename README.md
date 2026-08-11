# Voltline — Electrical Project Workspace

A Slack-style project workspace built for electrical contractors, foremen, journeymen, apprentices, and crews. Work is organized around **Projects**, not individual conversations — every project is its own workspace with a team conversation plus Prints, Notes & Materials, Tasks, Photos, Documents, and field tools (Checklists, Daily Logs, Inspections, Safety, Measurements, References).

## Stack

- **Next.js 16** (App Router, Server Actions) + **TypeScript**
- **Tailwind CSS v4** — blue-and-white design system defined as CSS tokens in `src/app/globals.css`
- **Prisma + SQLite** for persistence (`prisma/schema.prisma`)
- No auth system: the signed-in person is a single seeded Foreman account. The profile menu's **Switch Role** lets you preview the workspace as any role (Foreman/Admin, Electrical Contractor, Journeyman, Apprentice, Crew Member) to see how navigation and permissions change.

## Getting started

```bash
npm install
npm run db:push   # create the SQLite schema
npm run db:seed   # seed sample org, users, and 3 projects
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

- `npm run db:reset` — wipe and reseed the database
- `npm run build` — production build
- `npm run lint` — ESLint

## Project structure

- `src/app/(app)/` — the authenticated workspace: shell layout, Home, Projects, Search, Notifications, and the per-project routes under `projects/[projectId]/`
- `src/components/shell/`, `sidebar/`, `topbar/`, `project/` — the Slack-style three-pane layout (left nav, center workspace, collapsible right info panel)
- `src/components/conversation/` — the project chat feed, reactions, replies, and the Foreman-only **Convert → Task / Material Request / Issue** workflow
- `src/components/forms/` — shared quick-entry forms reused by both the section pages and the global Quick Action (+) button
- `src/lib/` — Prisma client, session/role helpers, status + nav config, search

## Notes on scope

File uploads (prints, documents, photos) aren't wired to blob storage in this build — adding one of these creates a metadata record so the UI and workflows are fully there, but there's no real file behind it yet.
