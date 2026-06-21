# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wheelswise — a motor insurance web app for the Kenyan market (sold under the "Med-Gen Insurance" brand). Users compare and buy **Comprehensive** or **Third Party (TPO)** cover for private, commercial, and PSV vehicles, then pay (M-Pesa / card). Next.js 15 App Router + TypeScript + Tailwind v4.

## Commands

Package manager is **pnpm** (enforced via `packageManager` field — do not use npm/yarn).

```bash
pnpm dev            # dev server (Next.js + Turbopack)
pnpm build          # production build
pnpm start          # serve production build
pnpm lint           # next lint (eslint, next/core-web-vitals + next/typescript + prettier)
pnpm format         # prettier --write
pnpm format:check   # prettier --check
```

There is **no test framework configured** — no test runner, no test files. Do not assume `pnpm test` exists.

Requires `NEXT_PUBLIC_API_BASE_URL` (backend API base, no version suffix — endpoints in `utilities/endpoints.ts` are appended to it). Set it in `.env.local`.

## Architecture

### The insurance purchase funnel is the core of the app

A linear, multi-step quote-and-buy flow. Each step is its own page under the `app/(vehicle-policy)/` route group, and progress is tracked by `coverStep` (a number) in `useInsuranceStore`. The route group's `layout.tsx` is a pass-through — **step gating/progress lives in the page components and the store, not the layout.** Order:

`/cover-type` → `/motor-type/[product_type]` → `/vehicle-value` → `/motor-subtype` → `/vehicle-details` → `/personal-details` → `/signup` → `/otp-verify` → `/dashboard` (→ `/dashboard/payment-method` → `/dashboard/payment-summary`).

State entered at each step is persisted to localStorage so the funnel survives reloads. When editing the funnel, remember a change to one step's store shape can break later steps that read it.

### State: four persisted Zustand stores

All under `stores/`, all use `persist` middleware → localStorage. The localStorage key is **not** the file name:

| Store | localStorage key | Holds |
|---|---|---|
| `useInsuranceStore` | `motor-insurance-details` | `cover`, `motorType`, `vehicleValue`, `motorSubtype`, `coverStep`, `tpoOption`, benefit ids, referral code |
| `useVehicleStore` | `vehicle-info-store` | selected motor type, value, seating capacity, tonnage, full vehicle-details form (`reset()`) |
| `usePersonalDetailsStore` | `personal-details-store` | first/last name, phone, email, id, KRA pin (`resetPersonalDetails()`) |
| `useUserStore` | `user-profile-store` | authenticated `UserProfile` (`resetProfile()`) |

These keys are duplicated as string literals in `utilities/axios-client.ts` (`forceLogout`) and `components/auth/ClearClientState.tsx` for state-wipe — **if you add/rename a persisted store, update both of those lists too.**

### Auth & token lifecycle

Cookie names are centralized in `utilities/constants.ts` — never hardcode them. Two-token model:

- **`__server_token__`** (access token): `httpOnly: false` so client JS can read it for `Authorization` headers via `nookies`. Short-lived (~15 min).
- **`__refresh_token__`**: `httpOnly: true`, ~30 days. Used only server-side / via `/api/refresh`.

`middleware.ts` guards routes off the access-token cookie: authenticated users hitting `/`, `/login`, `/register` are sent to `/dashboard`; unauthenticated users hitting `/dashboard/*` are redirected to `/` **and** the middleware sets a `clear_client_state=1` cookie. `components/auth/ClearClientState.tsx` (mounted in the root layout) reads that cookie on the next render, resets all Zustand stores, clears the relevant localStorage/sessionStorage keys, then deletes the cookie.

**401 refresh-then-retry exists on both sides** and must stay consistent:
- Server: `apiHandler`/`postHandler` in `utilities/api.ts` call `refreshAccessToken()` (`utilities/refresh-token.ts`) on a 401, retry once, else destroy cookies and throw.
- Client: `axiosAuthClient` interceptor in `utilities/axios-client.ts` POSTs `/api/refresh`, queues concurrent requests during a single refresh, retries, else `forceLogout()` → `/api/logout`.

**Login is staged, not immediate**: `utilities/login-flow.ts` stashes a `PendingLoginSession` in sessionStorage and only writes auth cookies in `finalizePendingLogin()` (after OTP), which also dispatches a `auth:changed` window event. KYC status rides along in the `__kyc_status__` cookie.

### API layer: server helpers vs. client axios

- **Server-side data access** uses `fetch` wrappers in `utilities/api.ts`, called from Server Components / route handlers / server actions. Note the error contract: `apiHandler`/`postHandler` **throw**, but the public `getData()` / `postData()` wrappers **swallow errors and return `{ results: [] }` / `{}`** — callers of those won't see failures, so check which you're using.
- **Client-side requests** use the two axios instances in `utilities/axios-client.ts`: `axiosClient` (public/unauthenticated) and `axiosAuthClient` (injects token + does the refresh dance). `utilities/axios-server.ts` is a bare instance for server use.
- **Next route handlers** under `app/api/*` exist mainly to set/clear `httpOnly` cookies the client can't (`/api/signup`, `/api/refresh`, `/api/logout`, `/api/vehicle/new`) and to proxy (`/api/pdf-proxy`, `/api/double-insurance`). **Server Actions** live in `app/actions/*` (e.g. `otp.ts`, `link-policy.ts`).

All API endpoint paths live in `utilities/endpoints.ts` — add new ones there rather than inlining.

### Routing & SEO

Two distinct surfaces share `app/`:
1. **The app**: `(vehicle-policy)/` funnel + `(auth)/` (login, signup, otp, forgot-password, dashboard, support). Route groups `(...)` are organizational only.
2. **Marketing/SEO pages** at the root: `about`, `faqs`, `guides/[slug]`, `motor-insurance/[location]`, `comprehensive-insurance`, `third-party-insurance`, `terms`. These pair with `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, rich `metadata` in `app/layout.tsx`, and `components/seo/GlobalJsonLd`. When adding public pages, keep sitemap/robots and JSON-LD in mind.

## Conventions

- **Path aliases** (`tsconfig.json`): `@/*` (root), plus `@components/*`, `@utilities/*`, `@types/*`, `@public/*`. shadcn aliases components to `@/components`, utils to `@/lib/utils`.
- **UI**: shadcn/ui (new-york style, neutral base) in `components/ui/`; feature components grouped by domain folder. Custom `Field*` primitives in `components/ui/field.tsx`. Icons from `lucide-react`. `cn()` from `lib/utils.ts`. Brand color `#397397`.
- **Forms**: React Hook Form + Zod; shared schemas/validators in `utilities/validation-schemas.ts`.
- **Tailwind v4** via PostCSS (`@tailwindcss/postcss`) — no `tailwind.config.js`; tokens are in `app/globals.css`. `tw-animate-css` for animations.
- **Shared types** live in `types/data.d.ts`.
- **Toasts**: `sonner` (`<Toaster>` mounted in root layout, top-center). Top progress bar: `nextjs-toploader`.
- **Do not auto-commit** — make changes and let the user review/commit.
