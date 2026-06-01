# @rapidset/rapidkit

## 0.15.1

### Patch Changes

- 4f82ae7: Fix flow doc page nav generating doubled basePath URLs (`/RapidKit/RapidKit/flows/...`) on the GitHub Pages docs site, which caused 404s when clicking between flows. Removed redundant `withBasePath()` wrapping on `next/link` hrefs in `FlowDocsPage` — Next.js already applies `basePath` to `<Link>` automatically.

## 0.15.0

### Minor Changes

- 685198e: theme and docs restructure, performance improvements

## 0.14.0

### Minor Changes

- 69fcfe2: expand theme token surface with v2 families: elevation scale, border-width, density multiplier, semantic states (success/warning/info), chart palette (chart-1..6), motion tokens, and accent variants (accent-2/3/4). Dialog and Sheet primitives now consume tokenized shadow + motion.
- 69fcfe2: populate the existing 11 themes with multi-accent palettes (accent-2/3/4, success/warning/info, chart-1..6, shadow-color tint) so each theme reads as a multi-hue product instead of a single-primary palette swap.
- 69fcfe2: add atmospheric, brutalist, and dense showcase themes that exercise the v2 token surface (radii, density, shadows, motion, palette).

## 0.13.0

### Minor Changes

- e2eb9f3: slim the published package and stop bloating consumer bundles:
  - Vite library build now externalizes every peer and runtime dependency (previously only `react` / `react-dom`), so consumers no longer get duplicated copies of Radix, Recharts, Zod, RHF, RTK, etc. bundled inside `dist/index.js`.
  - Output uses `preserveModules: true`, so each component ships as its own file under `dist/components/...`. Consumers that import a single component no longer pull the entire library through their bundler.
  - `publicDir` is disabled for the library build, so the docs site's marketing assets (favicon, brand SVGs, tech icons) no longer leak into the published tarball.
  - `vite-plugin-dts` now excludes `*.test.*`, so test type-declarations stop shipping in `dist/`.
  - `recharts`, `react-day-picker`, `date-fns`, and `sonner` are moved from `dependencies` to **optional `peerDependencies`**. Apps that don't use `Chart`, `DatePicker`, or `Toast` no longer install those packages. Apps that do use those components must add the matching peer to their own dependencies (see README).
  - `recharts` peer range is unpinned (was `2.15.4` exact) to avoid conflicting with consumer pins.

## 0.12.0

### Minor Changes

- 182e544: add monday theme

## 0.11.0

### Minor Changes

- 48dfd8c: add toast

## 0.10.0

### Minor Changes

- dd4753a: add showFrom column option to BaseTable for priority-based responsive visibility
- c0d115f: add Chart with line, bar, area, and pie variants

### Patch Changes

- 73c01b2: fix flows preview structure

## 0.9.0

### Minor Changes

- 8e93bd8: add NavMenu

### Patch Changes

- 8e93bd8: fix nav menu style

## 0.8.0

### Minor Changes

- bebf7fe: add NavMenu

## 0.7.0

### Minor Changes

- 88c5b5b: improve access control

## 0.6.0

### Minor Changes

- c82497c: add sidebar component

## 0.5.0

### Minor Changes

- 3f2ef2c: add useSearch and useDebounce hooks

## 0.4.0

### Minor Changes

- b11b466: add useFormHandlers hook

## 0.3.2

### Patch Changes

- fcc6322: Require latest major peer dependency baselines for modern installs by setting React/React DOM to v19, Tailwind CSS to v4, and Zod to v4.

## 0.3.1

### Patch Changes

- 2539af8: Require latest major peer dependency baselines for modern installs by setting React/React DOM to v19, Tailwind CSS to v4, and Zod to v4.

## 0.3.0

### Minor Changes

- a98e2e1: include components with release

## 0.2.1

### Patch Changes

- ccad2a0: streamline release process

## 0.2.0

### Minor Changes

- 4c7ad2d: fix versioning issue
