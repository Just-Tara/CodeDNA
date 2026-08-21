```markdown
# CodeDNA  

> A graph-powered explorer for discovering the relationships between software projects, technologies, concepts, features, and developers.

CodeDNA treats a software project as more than a name and a description — it's
a node in a graph, connected to the technologies it uses, the concepts it
implements, the features it provides, and the developers who built it.
The app lets you explore those connections instead of just listing them.

---

## Overview

CodeDNA lets you:

- Explore projects in a software ecosystem
- Discover the technologies used by each project
- Explore concepts associated with projects
- Discover project features
- See developers who contributed to projects
- Find projects with similar technical DNA
- Compare two projects side by side
- Explore a technology and every project that uses it
- Explore a concept and every project connected to it
- Explore a developer and their contributions
- Search across the entire ecosystem
- Visualize relationships as an interactive graph

## Why a graph model?

The interesting questions in this app are about **relationships**, not
records:

- Which technologies does a project use?
- Which other projects use those same technologies?
- Which projects share both technologies and concepts?
- Which technologies are commonly used together?
- Which developers contributed to projects using a particular technology?

These are graph traversal problems. Modeled relationally, each of these
turns into a growing pile of joins across junction tables. Modeled as a
graph, they're direct traversals:

```
(Project)-[:USES]->(Technology)
(Project)-[:INVOLVES]->(Concept)
(Project)-[:HAS_FEATURE]->(Feature)
(Developer)-[:CONTRIBUTED_TO {role}]->(Project)
```

That's the shape `lib/types.ts` and `lib/data.ts` mirror today, in plain
TypeScript objects — the same shape a Cypher-backed graph database would
return.

### Example

```
Project A                    Project B
    │                             │
    │ USES                  USES  │
    ▼                             ▼
         Node.js  ◄────────────────
```

CodeDNA traverses this to discover A and B share Node.js, then combines
that with shared concepts and features to compute a similarity score — see
`lib/graph.ts::similarity()`.

---

## Data model

### Nodes

| Node | Example properties |
|---|---|
| **Project** | `id`, `name`, `tagline`, `githubUrl` |
| **Technology** | `id`, `name`, `category` |
| **Concept** | `id`, `name` |
| **Feature** | `id`, `name` |
| **Developer** | `id`, `name`, `githubUsername` |

### Relationships

```
(Project)-[:USES]->(Technology)
(Project)-[:INVOLVES]->(Concept)
(Project)-[:HAS_FEATURE]->(Feature)
(Developer)-[:CONTRIBUTED_TO {role}]->(Project)
```

### A project's DNA, visualized

```
                    Technology
                   /          \
                  ▼            ▼
             Node.js        MongoDB
                  ▲            ▲
                   \          /
                    \        /
                     Project
                    /   |    \
                   ▼    ▼     ▼
              Concept Feature Developer
```

This is exactly what `components/GraphView.tsx` renders: the selected
project (or technology/concept) at the center, with rings of connected
nodes revealed progressively around it.

---

## Architecture

```
┌─────────────────────────────────────┐
│              User / UI               │
│  Projects · Technologies · Search    │
│  Concepts · Developers · Compare     │
└──────────────────┬────────────────────┘
                    ▼
┌─────────────────────────────────────┐
│         Next.js App Router          │
│     app/**/page.tsx (async RSC)     │
└──────────────────┬────────────────────┘
                    ▼
┌─────────────────────────────────────┐
│           Service Layer              │
│           lib/service.ts             │
│                                       │
│  getProjectDetail() · getSimilar...  │
│  compareProjects() · searchEcosystem │
└──────────────────┬────────────────────┘
                    ▼
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐      ┌─────────────────────┐
│  lib/data.ts   │      │   (future) CognoDB   │
│  mock dataset  │      │   via Neo4j driver    │
│  — ACTIVE NOW  │      │   — NOT CONNECTED     │
└───────────────┘      └─────────────────────┘
```

Every page calls **only** `lib/service.ts` — never `lib/data.ts` or
`lib/graph.ts` directly. That's the seam: today `service.ts` reads from
the in-memory mock arrays (with a small artificial delay standing in for
network latency, so the loading skeletons are real). Later, `service.ts`'s
function bodies become Cypher queries over a Neo4j driver, and nothing else
in the app changes — same types, same components, same routes.

---

## Project structure

```
app/
  page.tsx                        Home: search + stats + ecosystem preview
  projects/
    page.tsx                      All projects
    [id]/page.tsx                 CodeDNA page (graph + sections)
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
                                   Route-level states at every dynamic segment

components/
  GraphView.tsx                   Radial DNA graph: pan/zoom, progressive
                                   ring reveal, distinct shapes per entity
  SearchBar.tsx                   Client-side global search
  ProjectCard.tsx, DeveloperRow.tsx, ComparisonTable.tsx, TopNav.tsx,
  EcosystemPreview.tsx
  ui/
    Primitives.tsx                Badge, ActionButton, SectionLabel, etc.
    CollapsibleSection.tsx        Collapsible section (project page)
    Skeleton.tsx                  Loading skeletons matching each page shape
    States.tsx                    EmptyState / ErrorState

lib/
  types.ts                        Data model — Project, Technology, Concept,
                                   Feature, Developer, and their relationships
  data.ts                         Mock dataset (ACTIVE) + basic sync lookups
  graph.ts                        Pure derived queries: similarity,
                                   "often used with", search, etc.
  service.ts                      Async service layer every page calls —
                                   the seam described above
```

---

## Running locally (current — mock data)

No environment variables or database needed.

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

---

## Connecting a real backend (CognoDB + Neo4j)

**This section is a setup guide for the future integration — none of it is
wired into the app yet.** `lib/service.ts` currently reads from
`lib/data.ts`; connecting CognoDB means replacing the bodies of the
functions in `lib/service.ts` with the queries below, behind a
`lib/cognodb.ts` driver client. No other file needs to change.

### 1. Create a CognoDB instance

Create an account and a free `c0` instance at the CognoDB Cloud console,
and wait for it to finish provisioning. You'll get:

```
URI:      bolt+s://<instance-id>.databases.cognodb.cloud
Username: cognodb
Password: <generated>
```

### 2. Add environment variables

Create `.env.local` (never commit this file):

```
COGNODB_URI=bolt+s://<instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password
```

### 3. Add a driver client (`lib/cognodb.ts`, to be created)

CognoDB speaks openCypher over Bolt and is compatible with the official
Neo4j JavaScript driver:

```ts
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI!,
  neo4j.auth.basic(process.env.COGNODB_USERNAME!, process.env.COGNODB_PASSWORD!)
);

export async function runQuery<T = unknown>(query: string, params: Record<string, unknown> = {}) {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map((r) => r.toObject()) as T[];
  } finally {
    await session.close();
  }
}
```

Always use parameterized queries — never string-concatenate values into
Cypher:

```ts
const rows = await runQuery(
  `MATCH (p:Project {id: $id}) RETURN p`,
  { id }
);
```

### 4. Seed the graph (script to be added, e.g. `scripts/seed.ts`)

A seed script would create the same entities currently in `lib/data.ts` —
projects, technologies, concepts, features, developers — plus the
relationships between them, small enough to run comfortably on CognoDB's
free tier.

### 5. Swap the service layer

Each function in `lib/service.ts` gets its body replaced. For example:

```ts
// Before (current, mock):
export async function getProjectDetail(id: string) {
  await simulateLatency();
  const project = graph.findProject(id);
  ...
}

// After (CognoDB):
export async function getProjectDetail(id: string) {
  const [project] = await runQuery<Project>(
    `MATCH (p:Project {id: $id}) RETURN p`,
    { id }
  );
  if (!project) return null;
  const technologies = await runQuery<Technology>(
    `MATCH (:Project {id: $id})-[:USES]->(t:Technology) RETURN t`,
    { id }
  );
  // ...concepts, features, contributors, connectedProjects follow the same pattern
}
```

### Reference Cypher queries

```cypher
// Find a project
MATCH (p:Project {id: $id}) RETURN p

// Technologies used by a project
MATCH (p:Project {id: $id})-[:USES]->(t:Technology) RETURN t

// Concepts a project involves
MATCH (p:Project {id: $id})-[:INVOLVES]->(c:Concept) RETURN c

// Project contributors and their roles
MATCH (d:Developer)-[r:CONTRIBUTED_TO]->(p:Project {id: $id})
RETURN d, r.role

// Projects using a technology
MATCH (p:Project)-[:USES]->(t:Technology {id: $id}) RETURN p

// Similar projects via shared technologies
MATCH (p:Project {id: $id})-[:USES]->(t:Technology)<-[:USES]-(other:Project)
WHERE other.id <> p.id
RETURN DISTINCT other

// Similar projects via shared concepts
MATCH (p:Project {id: $id})-[:INVOLVES]->(c:Concept)<-[:INVOLVES]-(other:Project)
WHERE other.id <> p.id
RETURN DISTINCT other

// Ecosystem search
MATCH (p:Project)
WHERE toLower(p.name) CONTAINS toLower($query)
RETURN "project" AS type, p AS node
```

### Error handling pattern

Wrap graph calls so a database hiccup degrades gracefully instead of
crashing the page:

```ts
try {
  return await runQuery(query, params);
} catch (error) {
  console.error("CognoDB query failed:", error);
  return fallback;
}
```

---

## Loading, empty, error, and not-found states

Each dynamic route (`projects/[id]`, `technologies/[id]`, `concepts/[id]`,
`developers/[id]`, and their sub-routes) has:

- **`loading.tsx`** — a skeleton shaped like that page, shown automatically
  by Next while the (currently simulated, eventually real) data fetch is in
  flight.
- **`not-found.tsx`** — shown when `service.ts` returns `null` for an id
  that doesn't exist, via Next's `notFound()`.
- **`error.tsx`** — a client-side error boundary with a **Retry** button.

The homepage search has its own inline empty state ("No results found").

**Known limitation:** because these routes stream via `loading.tsx`, the
response headers commit with a `200` status before `notFound()` resolves —
the *content* correctly shows the not-found UI, but a plain HTTP client
sees `200` instead of `404`. This is a documented Next.js streaming
trade-off. If a strict 404 status matters more than the streamed skeleton
for a given route, the fix is `generateStaticParams` + `dynamicParams =
false` on that segment.

---

## Graph view

`components/GraphView.tsx` renders the radial DNA graph:

- **Shapes by entity type** — circle (technology), hexagon (concept),
  rounded square (feature/project)
- **Progressive reveal** — rings fade/scale in staggered by ring index
  (technologies → concepts → features)
- **Pan & zoom** — drag to pan, scroll-wheel to zoom on desktop, and
  always-visible +/−/reset buttons (the primary control on touch devices)
- **Mobile** — smaller radii/fonts and a "drag to pan · use +/− to zoom" hint

---

## Design system

Colors and typography are defined once in `app/globals.css` as Tailwind v4
`@theme` tokens (`--color-bg`, `--color-accent`, `--color-cyan`, etc.),
generating ordinary utility classes (`bg-surface`, `text-accent`,
`border-border`, ...) used throughout the components.

Typography falls back to the system sans-serif stack rather than fetching
Inter from Google Fonts, since builds here don't have network access to
`fonts.googleapis.com`. To use Inter:

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

---

## What's intentionally out of scope

No authentication, payments, chat, notifications system, or admin
dashboard. The GitHub link on a project page is a static URL — no GitHub
API integration.
```