# personal-site

Monorepo for a personal blog: a **Next.js** front end and a **NestJS** API backed by **PostgreSQL** and **Prisma**. Authentication uses **httpOnly cookies** (JWT) for sessions; signed-in users can post comments on published posts.

## Requirements

- **Node.js** 20+ (matches CI)
- **npm** (workspaces)
- **Docker** (optional, for local PostgreSQL and pgAdmin)

## Repository layout

| Path | Description |
|------|-------------|
| `apps/web` | Next.js App Router UI |
| `apps/api` | NestJS REST API, Prisma, JWT auth |

Root `package.json` scripts run both apps via npm workspaces.

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the root example and adjust as needed:

```bash
cp .env.example .env
```

- **Database:** `DATABASE_URL` must point at your Postgres instance (see Docker below).
- **API:** `apps/api` loads `.env` from its own directory in development. Copy `apps/api/.env.example` to `apps/api/.env` and set at least `DATABASE_URL` and `JWT_SECRET`.
- **Web:** `apps/web/.env.local` should define `NEXT_PUBLIC_API_BASE_URL` (default in code is `http://localhost:3001`).

`CORS_ORIGIN` should list the web origin (e.g. `http://localhost:3000`) when you set it explicitly; the API enables credentialed cross-origin requests for cookie-based auth.

### 3. Database

Start Postgres (and optionally pgAdmin) with Docker:

```bash
docker compose up -d postgres
```

Apply migrations and generate the Prisma client from `apps/api`:

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

For production or CI, use `npx prisma migrate deploy` instead of `migrate dev`.

Optional seed data:

```bash
npx prisma db seed
```

### 4. Run the stack

From the **repository root**:

```bash
npm run dev
```

This runs the API and the web app in parallel:

- **Web:** [http://localhost:3000](http://localhost:3000)
- **API:** [http://localhost:3001](http://localhost:3001)

A `predev` script frees ports 3000 and 3001 first so a previous dev session does not block startup (Windows-friendly).

## Scripts (root)

| Command | Purpose |
|---------|---------|
| `npm run dev` | API (watch) + Next.js dev server |
| `npm run build` | Production build: API then web |
| `npm run lint` | ESLint in both workspaces |
| `npm run test` | API unit tests (Jest) |

Workspace-specific scripts (e.g. `npm -w apps/api run prisma:studio`) are defined in each `package.json`.

## CI

GitHub Actions runs install, lint, test, and build on pushes and pull requests to `main` (see `.github/workflows/ci.yml`).

## Further reading

- API details and Nest conventions: [`apps/api/README.md`](apps/api/README.md)
- Docker services: [`docker-compose.yml`](docker-compose.yml) (Postgres on `5432`, pgAdmin on `5050` when enabled)
