# nuxt-template

A reusable Nuxt 4 starter with the boring decisions already made.

**Stack:** Nuxt 4 · Tailwind v4 · Drizzle ORM + libsql/Turso · Better Auth (Google OAuth) · Pinia · VueUse · @nuxt/icon (lucide) · @nuxt/fonts (DM Serif Display + DM Sans + DM Mono) · antfu eslint · husky + lint-staged · GitHub Actions lint workflow.

## Use this template

Click **Use this template** on GitHub, or:

```bash
gh repo create my-app --template Jettonn/nuxt-template --private --clone
cd my-app
```

Then customize:

1. **Edit [`app/lib/constants.ts`](app/lib/constants.ts)** — change `APP_NAME` and `APP_TAGLINE`.
2. **Edit [`package.json`](package.json)** — update `name` and `description`.
3. **Set up env** — copy `.env.example` to `.env` and fill in real values (see Auth section below).

## Prerequisites

- Node 22+ (`.nvmrc` pins this; run `nvm use` if you have nvm)
- [pnpm](https://pnpm.io) 10+
- [Turso CLI](https://docs.turso.tech/cli/installation): `brew install tursodatabase/tap/turso`

## First run

```bash
nvm use
cp .env.example .env
pnpm install
pnpm db:migrate    # apply the auth schema to local.db
pnpm dev           # turso dev + nuxt dev concurrently
```

App at <http://localhost:3000>, local DB at <http://127.0.0.1:8080>.

## Scripts

| Script                                          | What it does                               |
| ----------------------------------------------- | ------------------------------------------ |
| `pnpm dev`                                      | Runs `turso dev` + `nuxt dev` concurrently |
| `pnpm dev:db`                                   | Local Turso dev DB only (`local.db`)       |
| `pnpm build` / `preview` / `generate`           | Standard Nuxt commands                     |
| `pnpm lint` / `pnpm lint:fix`                   | ESLint with antfu config                   |
| `pnpm typecheck`                                | `nuxi typecheck`                           |
| `pnpm db:generate` / `db:migrate` / `db:studio` | Drizzle Kit                                |

## Auth (Google via Better Auth)

The auth flow is wired end-to-end:

- Schema: `user`, `session`, `account`, `verification` tables ([`app/lib/db/schema/auth.ts`](app/lib/db/schema/auth.ts))
- Server handler: [`server/api/auth/[...all].ts`](server/api/auth/%5B...all%5D.ts)
- Server middleware: [`server/middleware/auth.ts`](server/middleware/auth.ts) — guards `/app/*`, attaches user to `event.context`
- Server util: [`server/utils/auth.ts`](server/utils/auth.ts) — `defineAuthenticatedEventHandler` for protected API routes
- Client store: [`app/stores/auth.ts`](app/stores/auth.ts)
- Client middleware: [`app/middleware/auth.ts`](app/middleware/auth.ts)
- Sign-in page: [`app/pages/sign-in.vue`](app/pages/sign-in.vue)
- Protected dashboard: [`app/pages/app.vue`](app/pages/app.vue)

### Setup steps

1. **Google Cloud Console → APIs & Services → Credentials** → create OAuth 2.0 Client ID (Web application)
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
2. **Generate a session secret:** `openssl rand -base64 32`
3. **Fill `.env`** with the values from above plus your Turso credentials (or use `file:local.db` for the simplest local dev).
4. **Restart `pnpm dev`.**

For production, repeat step 1 with your real domain and put the env vars in your hosting platform's secrets. `BETTER_AUTH_URL` must exactly match the origin registered in Google Console.

## Icons

[Lucide](https://lucide.dev/) via `@nuxt/icon`:

```vue
<Icon name="i-lucide-rocket" />
```

## Fonts

DM Serif Display (headings, with italic emphasis), DM Sans (body), DM Mono (code/timestamps) — auto-loaded by `@nuxt/fonts`. Tailwind classes:

```html
<h1 class="font-serif">Headings</h1>
<p class="font-sans">Body</p>
<code class="font-mono">2024-05-07T15:30:00Z</code>
```

## UI

[`app/components/user-avatar.vue`](app/components/user-avatar.vue) is a reusable `<UserAvatar :image :name :size />` with image + deterministic initials fallback.

## Conventions

- File names: kebab-case (enforced by eslint)
- Style: double quotes, semicolons, 2-space indent (antfu config)
- Type definitions: prefer `type` over `interface` (`ts/consistent-type-definitions`)
- Env access: must go through `app/lib/env.ts` (validated with zod). Direct `process.env` access fails the lint rule `node/no-process-env`.

## Pre-commit

`husky` runs `lint-staged` → `pnpm lint` on staged files. The hook sources `nvm.sh` so it always uses the project's Node version regardless of the shell that invoked git.
