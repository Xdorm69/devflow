# DevFlow Backend

A REST API for DevFlow — a lightweight, self-hosted issue tracker (think a
small Jira/Linear): workspaces, projects, issues, comments, labels, and an
activity timeline.

## Stack

- **Runtime**: Node.js + TypeScript (native ESM, run directly via `tsx`)
- **Framework**: Express 5
- **Database**: SQLite via Prisma 7 (`@prisma/adapter-better-sqlite3`)
- **Auth**: JWT access tokens + httpOnly-cookie refresh tokens, bcrypt password hashing
- **Validation**: Zod

## Getting started

```bash
pnpm install        # or: npm install
cp .env.sample .env # then fill in real secrets (see below)
npx prisma generate # generates the Prisma client into src/generated/prisma
npx prisma migrate deploy   # applies the existing migrations to create dev.db
pnpm dev             # starts the API with hot reload on PORT (default 4000)
```

`npx prisma generate` needs network access to `binaries.prisma.sh` to fetch
its query engine — if you're behind a restrictive proxy/firewall, allow that
domain first.

### Environment variables

See `.env.sample` for the full list. At minimum you need:

| Variable | Required | Notes |
|---|---|---|
| `PORT` | yes | e.g. `4000` |
| `DATABASE_URL` | yes | `file:./dev.db` for local SQLite |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | yes | must be different from each other |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | no | defaults: `15m` / `30d` |
| `CORS_ORIGIN` | no | comma-separated allowed origins; unset = allow all (dev only) |
| `COOKIE_DOMAIN` | no | set in production if API + frontend share a parent domain |

### Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Run with hot reload (`tsx watch`) |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm build` | Bundle to `dist/server.js` via esbuild |
| `pnpm start` | Run the built bundle |

## Architecture

Each domain lives in its own folder under `src/modules/<name>/`, split into
four layers used consistently across every module:

```
<name>.router.ts      Express routes: wires middleware + validation + controller methods
<name>.controller.ts  Reads req/writes res; no business logic
<name>.service.ts     Business logic, authorization checks, orchestration
<name>.repository.ts  Prisma calls only — the only layer that imports `prisma`
<name>.validator.ts   Zod schemas + inferred input types
```

Requests flow as `router → validate → authenticate → authorize → controller
→ service → repository → Prisma`. Errors thrown anywhere as `ApiError` are
caught by the global `errorMiddleware` and turned into a consistent JSON
error shape.

### Modules

| Module | Responsibility |
|---|---|
| `auth` | register/login/refresh/logout, `/me` |
| `users` | public profile lookups, updating your own profile, searching users to invite |
| `workspace` | workspace CRUD, adding members |
| `projects` | projects within a workspace |
| `issues` | issues within a project: CRUD, status/priority, assignees, labels, activity feed |
| `comments` | comments on an issue |
| `labels` | labels within a workspace, attachable to issues |
| `activities` | internal — records a timeline entry whenever issues/comments change; not a standalone REST resource |

### Authorization model

Every workspace-scoped route (everything except `auth` and the top-level
`users` lookups) runs through `requireWorkspaceRole([...roles])`, which:

1. reads the workspace id from a route param (`workspaceId` by default — see
   note below),
2. looks up the caller's `WorkspaceMember` row,
3. 403s if they aren't a member, or aren't in the allowed role list.

Two permission levels are used throughout:
- **any member** (`MEMBER`/`ADMIN`/`OWNER`) — read access, creating issues/comments, assigning, labeling
- **admin only** (`ADMIN`/`OWNER`) — creating/deleting projects and labels, deleting issues

Resource ownership (e.g. "does this issue actually belong to this
project?") is checked in the service layer, not the middleware, since it
requires a DB lookup specific to that resource chain.

> **Note on the `:id` vs `:workspaceId` param name**: the top-level
> `/api/v1/workspace/:id` routes (update/delete a workspace) name their
> param `id`, while every route *nested under* a workspace
> (`/api/v1/workspace/:workspaceId/...`) names it `workspaceId`. This was
> the source of a pre-existing bug (see Changelog) — `requireWorkspaceRole`
> now takes the param name as an explicit second argument, defaulting to
> `"workspaceId"`.

## API documentation

See [`docs/API.md`](./docs/API.md) for the full endpoint reference.

## Changelog (this pass)

- **Fixed (security)**: `POST /workspace` accepted a client-supplied
  `ownerId` in the request body and made *that* user the owner — meaning
  any authenticated user could create a workspace owned by someone else.
  It now always uses the authenticated caller's id.
- **Fixed**: `requireWorkspaceRole` always read `req.params.workspaceId`,
  but the workspace router's own update/delete routes use `:id` — so
  updating or deleting a workspace 403'd for every user, always. The
  middleware now accepts the param name explicitly.
- **Added**: `users` module was present only as empty stub files
  (`users.controller.js`, `.service.js`, `.router.js` had no content) and
  wasn't mounted in `app.ts`. Filled in and mounted at `/api/v1/users`.
- **Added**: `projects`, `issues`, `comments`, `labels`, and `activities`
  modules — the Prisma schema already modeled all of these, but none had a
  controller/service/router, so most of the schema wasn't reachable through
  the API.

## Suggested next steps

See the "Where to go from here" section in the conversation this was
generated from — summarized:

1. **Add tests.** There's currently no test suite at all. Start with the
   service layer (easiest to unit test — repositories are trivially
   mockable) and one integration test per module hitting a real (test) DB.
2. **Add pagination** to every list endpoint (`GET` issues/comments/
   activities) before real data volume makes them slow — `cursor`-based is
   a natural fit with Prisma's `cursor`/`take` options.
3. **Rate-limit more than login/register.** Comment creation and issue
   creation are unlimited right now.
4. **WebSocket/SSE layer** for live updates (new comments, status changes)
   — the activity log you already have is a natural event source for this.
5. **Full-text search** across issue titles/descriptions — SQLite's FTS5
   extension is a low-effort option before reaching for something heavier.
6. **File attachments** on issues/comments — commonly the next feature
   request once a tracker has comments.
7. **Move off SQLite before multi-instance deployment** — `better-sqlite3`
   is single-writer/single-process; fine for one server, not for horizontal
   scaling. Prisma makes a Postgres swap mostly a schema/env change.
8. **OpenAPI spec** generated from the Zod schemas (`zod-to-openapi` or
   similar) so `docs/API.md` stays in sync with the code automatically
   instead of by hand.
