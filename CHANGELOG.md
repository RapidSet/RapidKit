# @rapidset/rapidkit

## 0.22.0

### Minor Changes

- 692b03a: SideBar: add an optional per-item `action` slot to `SideBarMenuItem`. The action renders as a trailing icon button that reveals on row hover/focus (or stays visible when `active`), so apps can offer inline row affordances such as favorite/unfavorite directly on nav and favorites items. Exposes a new `SideBarItemAction` type. Clicking the action does not trigger the row's navigation/`onSelect`, and the action is hidden in the collapsed icon rail.

## 0.21.0

### Minor Changes

- b92dcf0: SideBar: add an optional per-item `action` slot to `SideBarMenuItem`. The action renders as a trailing icon button that reveals on row hover/focus (or stays visible when `active`), so apps can offer inline row affordances such as favorite/unfavorite directly on nav and favorites items. Exposes a new `SideBarItemAction` type. Clicking the action does not trigger the row's navigation/`onSelect`, and the action is hidden in the collapsed icon rail.

## 0.20.0

### Minor Changes

- b291385: Refresh the `monday` theme: updated typography, surface palette, saturated
  status accents, soft shadows, and a reworked dark mode, with the theme
  contract, theming docs, and themes-data synced to the new token values.

### Patch Changes

- b291385: Make control-icon centering robust and modal content scrollable.
  - Center the `Search` magnifier and the `DropDown` clear (×) icon with a
    transform-free flex wrapper (`inset-y-0` + `items-center`) instead of
    `-translate-y-1/2` / `my-auto`. The previous approach could lose its
    vertical offset in consumers built on Tailwind v4 (the kit compiles with
    v3), pinning the icon to the top; the flex wrapper centers reliably
    everywhere.
  - `BaseModal` content now uses `overflow-y-auto`, so tall content scrolls
    instead of being clipped, and the header centers the close button with
    the title.

## 0.19.0

### Minor Changes

- 6776d74: Monday theme: bump default `--rk-button-height` and `--rk-control-height` to `2.5rem` (40px) — monday.com Vibe "Large" form-input scale. Internal padding is unchanged; content area scales naturally.

  `Search` (magnifying glass) and `DropDown` (clear `×`) used `top-1/2 -translate-y-1/2` for vertical centering, which rendered visibly off-center for absolutely-positioned icons under Tailwind v4 consumers — the icon sat in the upper half of the field instead of dead center. Switched both to `inset-y-0 my-auto` (auto-margin block centering), which is bulletproof against transform cascades. `Search` icon also gains `pointer-events-none` so it never blocks focus on click. CT coverage in `tests/ct/ControlBorders.ct.spec.tsx` asserts the icon's vertical center is within 1px of the field's center for both components.

## 0.18.0

### Minor Changes

- 0040ba5: Tailwind v4 compatibility and control-focus polish.
  - **Preflight cascade fix**: `styles.css` now ships defensive `revert-layer` rules for typographic margins and list margin/padding so Tailwind v4 consumers' layered utilities (`mt-*`, `pl-*`, …) and Tailwind v4's own layered preflight win against rapidkit's unlayered Tailwind v3 preflight. No more silent margin/padding loss in v4 host apps.
  - **Monday theme shadow neutralized**: `--rk-shadow-color` in `themes/monday.css` light mode shifts from `220 13% 40%` (saturated cool-blue at 40% lightness) to `220 13% 12%` (near-black, faint cool undertone). Modal and toast elevations now read as elevation, not a blue glow. Dark mode was already neutral.
  - **SideBar omits empty footer**: `<SidebarFooter>` is now skipped entirely when neither `footer` nor `user` is provided, instead of emitting an empty padded wrapper at the bottom of the sidebar.
  - **Focus border = ring color on form controls**: `Input`, `Textarea`, `DropDown` (SelectTrigger), and `DatePicker` trigger pick up `--rk-ring` on `:focus-visible`/`:focus` so focus reads as a brand-colored border, not stale resting gray. Matches shadcn's ring contract and the monday.com focus idiom.

## 0.17.0

### Minor Changes

- 1c495f3: Add a declarative form component family — `<Form>`, `<FormField>`, `<FormSubmit>` — plus a `useFormMutation` adapter hook that composes `useFormHandlers` with an RTK Query mutation.

  `<Form>` is a presentational shell that binds a `useFormHandlers` (or `useFormMutation`) result to a native `<form>`, provides context for field bindings, and exposes slots for submitting state, server-side error banners, success messages, and reset-on-success. `<FormField>` reads form state from context by name, auto-detects text vs checkbox binding from the value type, and either clones a single React element child with bindings + chrome props or invokes a render-prop with a full field args object. `<FormSubmit>` is a `<Button>` wrapper bound to context that auto-applies loading + disabled while submitting.

  `useFormMutation` keeps `<Form>` data-source agnostic by living as an opt-in adapter. It triggers an RTK Query mutation on submit, maps server failures back into field or form errors via a configurable `mapError` callback (with a structural fallback extractor), and exposes `isSubmitting`, `serverError`, and `lastResponse`. The mutation is structurally typed so the package stays type-only-aware of `@reduxjs/toolkit`.

  As part of this work, `Input.name`, `Input.onChange`, and `Checkbox.name` are now optional so that the element-child API of `<FormField>` type-checks without dummy props (FormField injects them at runtime via `cloneElement`). Both components also respect an explicit `id` prop and fall back to `name` when omitted, so the deterministic field id generated by `<FormField>` flows through the rendered input correctly.

  The login flow demo (`docs-nextra/registry/flows/login`) is migrated to use the new family as a real-world reference.

- 97f20a5: Monday.com UI parity: new chrome primitives and sidebar tinting.

  **New components**
  - `<TopBar>` — workspace canvas header with title/subtitle, leading + trailing action clusters, a primary quick-action button, an avatar dropdown user menu, and access-aware action gating. Suitable for the monday-style top chrome (notifications, inbox, invite, search, help, apps, avatar).
  - `<OnboardingChecklist>` — right-rail card with checkable items, optional descriptions, dismiss control, and a derived progress bar (primary / success tones). Items are individually interactive via `onSelect` or `href`.
  - `<BoardCard>` — tile for recent-item grids: title + optional icon, preview slot with a default colorful skeleton, breadcrumb footer, and a star toggle that doesn't intercept the card's primary click. Renders as `<button>` when `onClick` is given, `<a>` when `href` is given, plain `<div>` otherwise.

  **SideBar extensions**
  - New `workspace` prop renders a workspace switcher row (avatar + name + subtitle, optional dropdown actions) below the brand.
  - New `favorites` prop renders a collapsible Favorites section above the main nav, sharing `SideBarMenuItem` shape.
  - New `itemVariant` prop on `<SideBar>` and `<SideBarNavMenu>`: `'minimal'` (default, current behavior) or `'pill'` (filled hover/active background using the new sidebar accent tokens — matches monday's selected-item treatment).

  **Theme token surface**
  - New `--rk-sidebar-background`, `--rk-sidebar-foreground`, `--rk-sidebar-primary`, `--rk-sidebar-primary-foreground`, `--rk-sidebar-accent`, `--rk-sidebar-accent-foreground`, `--rk-sidebar-border`, `--rk-sidebar-ring` tokens. The shadcn-side `--sidebar-*` slots now read from these, defaulting to the existing `--rk-card` / `--rk-accent` / `--rk-border` / `--rk-ring` values — themes that don't override the new family render unchanged.
  - The `monday` theme uses the new tokens to set a mint sidebar tint (light + dark), refines the primary blue (`210 100% 46%`) to match monday.com exactly, lifts radius to `0.75rem`, and softens the button/control shadows. Other themes are untouched.

  **Backward compatibility**

  All new props are optional; existing `<SideBar>` consumers and existing themes render unchanged. The pill item variant is opt-in.

- 3429b37: BREAKING: the `recharts` optional peer dependency now requires `^3.0.0` (was `^2.15.0`). Apps that render `Chart` must upgrade recharts to v3 — recharts 2.x is deprecated upstream.

  The `Chart` public API and documented behavior are unchanged: chart roots explicitly opt out of recharts v3's new default `accessibilityLayer` so the container keeps its `role="img"` + `aria-label` contract, and the internal shadcn chart primitive is retyped against recharts v3 tooltip/legend content types.

  Also refreshes the `sonner` dev dependency to the latest 2.x; the `sonner` peer range (`^2.0.0`) is unchanged and `Toast` requires no consumer action.

### Patch Changes

- 0c7405e: Monday theme: align to monday.com visual identity per ModayStyle.md. Neutral cool-gray sidebar (was mint), 4px/8px radii (was 12px), 32px control/button height (was 40px), 75ms snap motion (was 200ms base), pure-yellow warning (was orange), refined border/shadow neutrals to the spec hex values, and optional `--rk-monday-app-strip*` tokens for the 48px dark launcher chrome.

## 0.16.2

### Patch Changes

- fdec363: Fix `BaseTable` not scrolling in place when its parent bounds its height. Previously, the scroll area `<div>` was bounded by its flex parent but had no `overflow` declaration, and the inner shadcn `<Table>` primitive's `overflow-auto` wrapper had no height bound — so the table grew past its container and pushed the pagination footer below the fold. `BaseTable` now owns the scroll container directly (`flex-1 min-h-0 overflow-auto`) and renders the `<table>` element without the extra shadcn wrapper, so vertical scrolling engages, the sticky `<thead>` stays pinned to the top of the visible area, and the pagination footer stays anchored at the bottom. Horizontal scroll and sticky-column behavior are unchanged.
- 614bfcd: Fix the RapidKit logo in the dashboard flow demo's sidenav 404ing on the deployed docs site. The demo's `Sidebar` used a root-relative `/rapidkit.svg` path, which resolves to the domain root on GitHub Pages instead of the `/RapidKit` basePath. Switched to a stable absolute URL of the same asset hosted on GitHub raw so the demo renders the logo in both the deployed preview and any consumer's app without depending on a docs-only basePath helper.
- 0adbe6e: Docs: two flow-page fixes.
  1. The Code tab on `/flows/*` was capped at 540px while the Preview tab uses `min(88vh, 920px)` — the panel felt cramped vs. the screenshot beside it. The multi-file Code panel now matches the Preview height, with the same `--rk-flow-code-height` CSS custom-property override available for consumers who want a different size.
  2. `docs-nextra/themes-scoped.css` is now gitignored. It's auto-generated by `scripts/themes-to-scoped-css.mjs` and regenerated by every `predocs:*` hook; prettier was wrapping long CSS values on commit, which the script then unwrapped on the next build, producing perpetual drift. The `themes-data.json` sibling (deterministic JSON) stays tracked.

## 0.16.1

### Patch Changes

- 06612a3: Docs: pre-render the flow Code-tab syntax highlighting at build time. Shiki now runs inside `scripts/generate-example-code-manifest.mjs` (dual github-light/github-dark themes) and emits the highlighted HTML inside `FLOW_EXAMPLE_FILES`. `MultiFileCodePreview` renders the precomputed HTML directly — the Code tab paints already-colored on the first frame, with no plain-text flash on initial open or when switching between files.

## 0.16.0

### Minor Changes

- c132013: Docs: redesign the flow code preview into a shadcn-style multi-file viewer. The Code tab on `/flows/login` and `/flows/dashboard` now shows a left-rail file tree and a per-file pane with full path, per-file copy, and Shiki highlighting. Each flow's source lives in `docs-nextra/registry/flows/<flow>/` as real `.tsx`/`.ts` modules; the preview iframe imports the same modules, so displayed code and rendered preview can't drift.

### Patch Changes

- c132013: Docs: reorganize each flow's registry into production-style folders (`components/`, `consts/`, `schemas/`, `types/`) so the file tree on `/flows/login` and `/flows/dashboard` reads like a real consumer codebase. Refresh the file-tree styling toward a Zed-editor aesthetic — compact rows, lighter chrome, accent-tint active state, no indent guides — and color file icons by extension (TS blue, JS yellow, CSS purple, JSON orange, MD gray) for VS Code-style scannability.

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
