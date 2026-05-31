---
'@rapidset/rapidkit': minor
---

slim the published package and stop bloating consumer bundles:

- Vite library build now externalizes every peer and runtime dependency (previously only `react` / `react-dom`), so consumers no longer get duplicated copies of Radix, Recharts, Zod, RHF, RTK, etc. bundled inside `dist/index.js`.
- Output uses `preserveModules: true`, so each component ships as its own file under `dist/components/...`. Consumers that import a single component no longer pull the entire library through their bundler.
- `publicDir` is disabled for the library build, so the docs site's marketing assets (favicon, brand SVGs, tech icons) no longer leak into the published tarball.
- `vite-plugin-dts` now excludes `*.test.*`, so test type-declarations stop shipping in `dist/`.
- `recharts`, `react-day-picker`, `date-fns`, and `sonner` are moved from `dependencies` to **optional `peerDependencies`**. Apps that don't use `Chart`, `DatePicker`, or `Toast` no longer install those packages. Apps that do use those components must add the matching peer to their own dependencies (see README).
- `recharts` peer range is unpinned (was `2.15.4` exact) to avoid conflicting with consumer pins.
