# DevFlow API Reference

Base URL: `http://localhost:4000/api/v1` (or your deployed origin).

## Conventions

**Response envelope.** Every response is JSON shaped as:

```jsonc
// success
{ "success": true, "message": "...", "data": { ... } }
// error
{ "success": false, "message": "...", "errors": [ { "field": "email", "message": "Invalid email address" } ] }
```

**Auth.** Protected routes require `Authorization: Bearer <accessToken>`.
The refresh token is a separate httpOnly cookie set by `/auth/login`,
`/auth/register`, and `/auth/refresh` — you never handle it directly from
client JS.

**Errors.** Standard HTTP status codes: `400` validation, `401`
unauthenticated, `403` unauthorized (authenticated but not allowed), `404`
not found, `409` conflict (duplicate slug/email/username/etc).

**IDs.** All resource ids are UUIDs (strings).

---

## Auth — `/auth`

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/register` | – | `{ username, email, password }` | Rate-limited: 20/hour per IP |
| POST | `/login` | – | `{ email, password }` | Rate-limited: 10/15min per IP |
| POST | `/refresh` | refresh cookie | – | Rotates the refresh token |
| POST | `/logout` | refresh cookie (optional) | `{ everywhere?: boolean }` | `everywhere: true` revokes all sessions |
| GET | `/me` | Bearer | – | Current user's profile |

`password` rules: 8–72 chars, at least one lowercase, one uppercase, one
digit. `username`: 3–30 chars, letters/numbers/underscore only.

Register/login responses:
```jsonc
{ "success": true, "message": "Logged in successfully",
  "data": { "user": { "id", "username", "email", "avatarUrl", "bio", "createdAt", "updatedAt" },
            "accessToken": "..." } }
```

---

## Users — `/users`

| Method | Path | Auth | Body/Query | Notes |
|---|---|---|---|---|
| GET | `/search?q=` | Bearer | query: `q` | Prefix search over username/email, max 10 results |
| PATCH | `/me` | Bearer | `{ username?, bio?, avatarUrl? }` | Updates your own profile |
| GET | `/:id` | Bearer | – | Public profile lookup |

---

## Workspaces — `/workspace`

| Method | Path | Auth | Body | Role required |
|---|---|---|---|---|
| POST | `/` | Bearer | `{ name, slug, description? }` | – (you become `OWNER`) |
| GET | `/` | Bearer | – | – (returns workspaces you own + are a member of) |
| GET | `/:id` | Bearer | – | – |
| PATCH | `/:id` | Bearer | `{ name?, slug?, description? }` | `OWNER`/`ADMIN`, and only the owner |
| DELETE | `/:id` | Bearer | – | `OWNER`/`ADMIN` |
| POST | `/:workspaceId/members` | Bearer | `{ userId }` | `OWNER`/`ADMIN` — adds as `MEMBER` |

`GET /` response: `{ ownedWorkspaces: Workspace[], memberWorkspaces: Workspace[] }`.

Everything below this point is **nested under a workspace** — replace
`:workspaceId` with the id from the routes above. All of it requires
`Authorization: Bearer <accessToken>` and workspace membership.

---

## Projects — `/workspace/:workspaceId/projects`

| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/` | `ADMIN`/`OWNER` | `{ name, slug, description? }` |
| GET | `/` | any member | – |
| GET | `/:projectId` | any member | – |
| PATCH | `/:projectId` | `ADMIN`/`OWNER` | `{ name?, slug?, description? }` |
| DELETE | `/:projectId` | `ADMIN`/`OWNER` | – |

`slug` must be lowercase letters/numbers/hyphens, unique per workspace.

---

## Labels — `/workspace/:workspaceId/labels`

| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/` | `ADMIN`/`OWNER` | `{ name, color }` |
| GET | `/` | any member | – |
| PATCH | `/:labelId` | `ADMIN`/`OWNER` | `{ name?, color? }` |
| DELETE | `/:labelId` | `ADMIN`/`OWNER` | – |

`color` must be a hex code, e.g. `#22C55E`. `name` unique per workspace.

---

## Issues — `/workspace/:workspaceId/projects/:projectId/issues`

| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/` | any member | `{ title, description?, priority? }` |
| GET | `/` | any member | query: `status?`, `priority?`, `assigneeId?` |
| GET | `/:issueId` | any member | – |
| PATCH | `/:issueId` | any member | `{ title?, description? }` |
| PATCH | `/:issueId/status` | any member | `{ status }` |
| PATCH | `/:issueId/priority` | any member | `{ priority }` |
| DELETE | `/:issueId` | `ADMIN`/`OWNER` | – |
| POST | `/:issueId/assignees` | any member | `{ userId }` |
| DELETE | `/:issueId/assignees/:userId` | any member | – |
| POST | `/:issueId/labels` | any member | `{ labelId }` |
| DELETE | `/:issueId/labels/:labelId` | any member | – |
| GET | `/:issueId/activities` | any member | – timeline for this issue |

`status`: `OPEN` \| `IN_PROGRESS` \| `RESOLVED` \| `CLOSED`.
`priority`: `LOW` \| `MEDIUM` \| `HIGH` \| `CRITICAL` (default `MEDIUM` on create).

An issue response includes `creator`, `assignees` (with nested `user`),
`labels` (with nested `label`), and a `_count.comments`.

Assigning a user validates that they're a member of the workspace first
(`400` if not). Attaching a label validates it belongs to the same
workspace as the issue (`404` if not).

Every create/update/status/priority/assign/unassign/label action writes an
`Activity` row automatically — that's what `/:issueId/activities` returns.

---

## Comments — `/workspace/:workspaceId/projects/:projectId/issues/:issueId/comments`

| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/` | any member | `{ content }` |
| GET | `/` | any member | – |
| PATCH | `/:commentId` | author only | `{ content }` |
| DELETE | `/:commentId` | author, or `ADMIN`/`OWNER` | – |

`content`: 1–5000 chars.

---

## Example flow

```bash
# 1. Register + capture the access token
curl -X POST localhost:4000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"asha","email":"asha@example.com","password":"Secret123"}'

TOKEN=<accessToken from the response>

# 2. Create a workspace (you become OWNER)
curl -X POST localhost:4000/api/v1/workspace \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Acme","slug":"acme"}'

WORKSPACE_ID=<id from the response>

# 3. Create a project
curl -X POST localhost:4000/api/v1/workspace/$WORKSPACE_ID/projects \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Website Revamp","slug":"website"}'

PROJECT_ID=<id from the response>

# 4. Create an issue
curl -X POST localhost:4000/api/v1/workspace/$WORKSPACE_ID/projects/$PROJECT_ID/issues \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Fix broken footer link","priority":"HIGH"}'
```
