# Project DNA

A graph-powered software project explorer. Search for a project and see its
"DNA" — the technologies, concepts, features, and people it's connected to —
then follow those connections outward to discover related projects.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project structure

```
app/
  page.tsx                        Home: search + stats + ecosystem preview
  projects/
    page.tsx                      All projects
    [id]/page.tsx                 Project DNA page (graph + sections)
    [id]/similar/page.tsx         Explainable "find similar" results
    [id]/compare/page.tsx         Pick a second project to compare
  compare/page.tsx                Comparison result (?a=id&b=id)
  technologies/
    page.tsx                      All technologies, grouped by category
    [id]/page.tsx                 Technology detail: used-by + affinities
  concepts/[id]/page.tsx          Concept detail: projects that involve it
  developers/
    page.tsx                      All developers
    [id]/page.tsx                 Developer profile
  loading.tsx, not-found.tsx, error.tsx
                                   Route-level states (see below), present
                                   at every dynamic segment

components/
  GraphView.tsx                   The radial DNA graph (client component):
                                   pan/zoom, progressive ring reveal,
                                   distinct node shapes per entity type
  SearchBar.tsx                   Client-side global search
  ProjectCard.tsx, DeveloperRow.tsx, ComparisonTable.tsx, TopNav.tsx,
  EcosystemPreview.tsx
  ui/
    Primitives.tsx                Badge, ActionButton, SectionLabel, etc.
    CollapsibleSection.tsx        Collapsible section (project page)
    Skeleton.tsx                  Loading skeletons matching each page shape
    States.tsx                    EmptyState / ErrorState

lib/
  types.ts                        Data model (Project, Technology, Concept,
                                   Feature, Developer, and the relationship
                                   shapes between them)
  data.ts                         Raw mock dataset + basic sync lookups
  graph.ts                        Pure derived queries: similarity,
                                   "often used with", search, etc.
  service.ts                      Async service layer — see below
```

## The mock-to-real-backend seam

Every page calls functions from `lib/service.ts`, never `lib/data.ts` or
`lib/graph.ts` directly. `service.ts` is async and adds a small artificial
delay (`simulateLatency`) before returning — standing in for the real round
trip described in the product spec:

```
Frontend → Next.js API → Neo4j driver → CognoDB
```

When the real backend is ready, only `lib/service.ts` changes (its function
bodies become `fetch()` calls or direct driver queries); every component,
page, type, and route stays the same. `lib/data.ts` is the only file that
holds the mock dataset itself.

The artificial latency isn't just decorative — it's what makes the
`loading.tsx` files (Next's file-based Suspense boundaries) actually have
something to show, so the loading skeletons you see are genuine streaming
states, not a client-side timeout hack.

## Loading, empty, error, and not-found states

Each dynamic route (`projects/[id]`, `technologies/[id]`, `concepts/[id]`,
`developers/[id]`, and their sub-routes) has:

- `loading.tsx` — a skeleton shaped like that page (`ProjectPageSkeleton` /
  `ListPageSkeleton` from `components/ui/Skeleton.tsx`), shown automatically
  by Next while the async data fetch is in flight.
- `not-found.tsx` — shown when `service.ts` returns `null` for an id that
  doesn't exist (via Next's `notFound()`).
- `error.tsx` — a client-side error boundary with a **Retry** button
  (`reset()`), for genuine runtime failures.

The homepage search has its own inline empty state ("No results found").

### Known limitation: HTTP status on not-found dynamic routes

Because these routes stream (via `loading.tsx`), the initial response
headers commit with a `200` status before the async data fetch resolves and
`notFound()` throws. The *content* correctly shows the not-found UI, but a
plain HTTP client (or a crawler that doesn't execute JS) sees `200` instead
of `404` for e.g. `/projects/some-bad-id`. This is a documented Next.js
streaming trade-off, not specific to this app.

If a strictly correct 404 status matters more than the streamed loading
skeleton for a given route (e.g. for SEO), the fix is `generateStaticParams`
+ `dynamicParams = false` on that segment, which resolves unknown ids at the
routing layer instead of inside the page component — at the cost of no
longer showing a per-request loading skeleton for that route.

## Graph view

`components/GraphView.tsx` renders the radial DNA graph:

- **Shapes by entity type** — circle (technology), hexagon (concept),
  rounded square (feature/project) — colored per the design system.
- **Progressive reveal** — rings fade/scale in staggered by ring index
  (technologies → concepts → features) whenever the center node changes.
- **Pan & zoom** — drag to pan, scroll-wheel to zoom on desktop, and
  always-visible +/−/reset buttons (the primary control on touch devices).
- **Mobile** — smaller radii/fonts and a "drag to pan · use +/− to zoom"
  hint below a set breakpoint.

## Design system

Colors, spacing, and the "electric lime + cyan graph accents on dark
neutral" palette are defined once in `app/globals.css` as Tailwind v4
`@theme` tokens (`--color-bg`, `--color-accent`, `--color-cyan`, etc.),
which generate ordinary utility classes (`bg-surface`, `text-accent`,
`border-border`, ...) used throughout the components.

Typography currently falls back to the system sans-serif stack rather than
fetching Inter from Google Fonts, since this environment doesn't have
network access to `fonts.googleapis.com` at build time. To use Inter, swap
in `next/font/google` in `app/layout.tsx`:

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

## What's intentionally out of scope

Per the product spec: no authentication, payments, chat, notifications
system, or admin dashboard. The GitHub link on a project page is just a
static URL — no GitHub API integration.
