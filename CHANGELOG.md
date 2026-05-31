# @rapidset/rapidkit

## 1.0.0

### Major Changes

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
