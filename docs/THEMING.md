# Theming Guide

Preview, configure, and validate RapidKit themes from one page.

## Live Preview

Use the interactive playground below to switch themes at runtime and review component rendering.

<ThemePlayground />

## Goals

- Ship pre-built themes out of the box.
- Keep components token-driven and host-app agnostic.
- Enable deterministic AI workflows for switching and creating themes.

## Token Surface

RapidKit components resolve color and radius from namespaced CSS variables.

Required tokens:

- `--rk-background`
- `--rk-foreground`
- `--rk-card`
- `--rk-card-foreground`
- `--rk-popover`
- `--rk-popover-foreground`
- `--rk-primary`
- `--rk-primary-foreground`
- `--rk-secondary`
- `--rk-secondary-foreground`
- `--rk-muted`
- `--rk-muted-foreground`
- `--rk-accent`
- `--rk-accent-foreground`
- `--rk-destructive`
- `--rk-destructive-foreground`
- `--rk-border`
- `--rk-input`
- `--rk-ring`
- `--rk-radius`

Optional style tokens used by core components (recommended):

- `--rk-font-sans`
- `--rk-font-mono`
- `--rk-button-height`
- `--rk-button-padding-x`
- `--rk-button-padding-y`
- `--rk-button-font-size`
- `--rk-button-font-weight`
- `--rk-button-letter-spacing`
- `--rk-button-shadow`
- `--rk-button-shadow-hover`
- `--rk-control-height`
- `--rk-control-padding-x`
- `--rk-control-padding-y`
- `--rk-control-font-size`
- `--rk-control-shadow`
- `--rk-control-shadow-focus`
- `--rk-checkbox-size`
- `--rk-checkbox-radius`

### Extended Token Families (v2)

These optional token families let a theme change feel — not just hue. Safe defaults live in `src/styles.css` so existing themes work unchanged; opt in by overriding any of these in your theme `:root`.

**Elevation scale** — shadcn primitives (`Card`, `Popover`, `Dialog`, `DropdownMenu`, `Sheet`) read shadow utilities through these tokens:

- `--rk-shadow-color` (HSL triplet — tint shadows with the primary hue, or use `0 0% 0%` for neutral)
- `--rk-shadow-xs`, `--rk-shadow-sm`, `--rk-shadow-md`, `--rk-shadow-lg`, `--rk-shadow-xl`

**Border presence**

- `--rk-border-width` — default `1px`. Set to `2px` for slabby/brutalist themes, `0` to drop borders entirely.

**Density**

- `--rk-density` — unitless multiplier (default `1`). Multiplies button/control heights. `0.875` = compact admin, `1.05` = spacious editorial.

**Semantic states**

- `--rk-success` + `--rk-success-foreground`
- `--rk-warning` + `--rk-warning-foreground`
- `--rk-info` + `--rk-info-foreground`

Available as Tailwind utilities: `bg-success`, `text-success-foreground`, etc.

**Chart palette** (categorical, 6 colors)

- `--rk-chart-1` through `--rk-chart-6` — exposed as `bg-chart-1` … `bg-chart-6` and via `chart.tsx`.

**Motion**

- `--rk-motion-fast` (~120ms), `--rk-motion-base` (~200ms), `--rk-motion-slow` (~320ms)
- `--rk-ease-standard`, `--rk-ease-emphasized`

Tailwind utilities: `duration-fast` / `duration-base` / `duration-slow`, `ease-standard` / `ease-emphasized`. `prefers-reduced-motion: reduce` neutralizes all three durations automatically.

**Accent variants**

- `--rk-accent-2` + `--rk-accent-2-foreground`
- `--rk-accent-3` + `--rk-accent-3-foreground`
- `--rk-accent-4` + `--rk-accent-4-foreground`

Tailwind utilities: `bg-accent-2`, `text-accent-2-foreground`, `bg-accent-3`, etc. Useful for status pills, kanban group colors, multi-tag badges, or anywhere a single `accent` slot isn't expressive enough.

Defaults fall back to `--rk-accent` / `--rk-accent-foreground`, so themes that don't override them render harmlessly. Core primitives don't consume these — consumers opt in via the utility classes. The Monday theme overrides all three with brand greens/oranges/yellows to show what this looks like in practice.

**Sidebar surface**

- `--rk-sidebar-background` + `--rk-sidebar-foreground`
- `--rk-sidebar-primary` + `--rk-sidebar-primary-foreground`
- `--rk-sidebar-accent` + `--rk-sidebar-accent-foreground` — hover / selected item background and text
- `--rk-sidebar-border`
- `--rk-sidebar-ring`

Set these in a theme to tint the sidebar independently of `--rk-card`. The internal `--sidebar-*` slots that `<SideBar>` renders through read from the `--rk-sidebar-*` family, which themselves default to the equivalent `--rk-card` / `--rk-accent` / `--rk-border` / `--rk-ring` values — themes that don't override the family inherit the card chrome unchanged. The Monday theme uses a mint tint here so the navigation lane reads distinct from the white workspace canvas.

### Personality Presets

Four themes that exercise the extended token surface to show how different a theme can feel:

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/brutalist.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/dense.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/atmospheric.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/monday.css';
```

- **brutalist** — `--rk-radius: 0`, `--rk-border-width: 2px`, hard offset shadows, snappy motion.
- **dense** — `--rk-density: 0.875`, subtle shadows, tuned categorical chart palette, fast motion.
- **atmospheric** — large radii, tinted diffuse shadows, roomier density, soft easing.
- **monday** — monday.com Vibe-inspired: brand blue `#0073EA` on a cool-gray `#F6F7FB` canvas, Figtree/Poppins/Inter webfonts auto-loaded, saturated status pills wired into `--rk-accent-2/3/4` (Done green, Working orange, Stuck red), 32 px control rhythm, 100–150 ms motion, soft navy-tinted shadows. Ships an authentic Vibe "Night" mode that swaps the canvas to `#181B34` and keeps brand blue at full saturation.

## Using Built-In Themes

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';
```

Swap to slate:

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/slate.css';
```

Additional built-in options:

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/carbon.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/corporate.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/ocean.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/polaris.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/midnight.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/monday.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/sand.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/forest.css';
```

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/sunset.css';
```

## AI-Friendly Commands

List themes:

```bash
pnpm theme:list
```

Apply a built-in theme to the workspace default:

```bash
pnpm theme:apply --theme default
pnpm theme:apply --theme slate --mode dark
```

Create a custom theme scaffold:

```bash
pnpm theme:create --id brand-x --from default
```

This command creates:

- `src/themes/brand-x.css`
- `ai/contracts/themes/brand-x-theme.contract.json`
- a new `themes` entry in `ai/contracts/index.json`

## Extending With shadcn Host Tokens

`src/styles.css` bridges shadcn tokens (`--background`, `--primary`, and others) to RapidKit tokens (`--rk-*`). If your host app already defines shadcn tokens, components can render correctly without rewriting component code.

For full control, set `--rk-*` tokens directly in your app theme CSS.

## Theme Configuration Workflow

This section explains how theme selection, theme files, and runtime mode behavior are configured in this workspace.

### Configuration Files

- `ai/contracts/index.json`: source of truth for available theme entries (`id`, `contractPath`, `cssPath`).
- `ai/contracts/themes/*.contract.json`: contract metadata for each theme.
- `ai/theme.schema.json`: JSON schema that validates theme contract structure.
- `ai/theme.active.json`: current workspace-selected theme and preferred mode metadata.
- `src/themes/active.css`: generated import file that points to the selected theme stylesheet.
- `src/themes/*.css`: built-in theme token files.

### Theme Selection Flow

1. Run `pnpm theme:list` to inspect available themes from contracts.
2. Run `pnpm theme:apply --theme <theme-id> [--mode light|dark|system]`.
3. The script updates:
   - `src/themes/active.css` to import the selected `src/themes/<id>.css`
   - `ai/theme.active.json` with `themeId`, `mode`, and `updatedAt`
4. Components pick up tokens via `src/styles.css` and Tailwind semantic utilities.

### Runtime Mode Behavior

`--mode` is stored as workspace metadata in `ai/theme.active.json`.

It does not automatically apply `.dark` at runtime. Dark mode still depends on your runtime class strategy (Tailwind `darkMode: ['class']`), so the host app or preview shell must control the `.dark` class.

### Typography And Component Style Tokens

Themes support styling beyond color. In addition to color and radius tokens, the library consumes optional typography and component-shape tokens, including:

- `--rk-font-sans` and `--rk-font-mono` for typeface control
- button sizing and rhythm tokens (`--rk-button-height`, `--rk-button-padding-x`, `--rk-button-padding-y`)
- button typography tokens (`--rk-button-font-size`, `--rk-button-font-weight`, `--rk-button-letter-spacing`)
- button elevation tokens (`--rk-button-shadow`, `--rk-button-shadow-hover`)
- control layout tokens (`--rk-control-height`, `--rk-control-padding-x`, `--rk-control-padding-y`, `--rk-control-font-size`)
- control elevation tokens (`--rk-control-shadow`, `--rk-control-shadow-focus`)
- checkbox shape tokens (`--rk-checkbox-size`, `--rk-checkbox-radius`)

When creating a custom theme with `pnpm theme:create`, copy and tune these tokens in the generated CSS so components remain visually polished out of the box.

### Validation And Quality Gates

Run contract validation after theme changes:

```bash
pnpm validate:contracts
```

Theme-related CI checks in `.github/workflows/ci.yml` include:

- `pnpm theme:list` to ensure registry metadata remains readable
- `pnpm test:scripts` to verify theme script integration behavior
- `pnpm validate:contracts` to confirm theme contract/index consistency
- standard lint/type/test/build quality gates before release

Docs publishing CI in `.github/workflows/docs-deploy.yml` builds Nextra and deploys documentation to GitHub Pages on `main`.

### AI Context And MCP Compatibility

Theme metadata is intentionally machine-readable for AI systems:

- `ai/contracts/index.json` provides the theme registry
- `ai/contracts/themes/*.contract.json` defines theme contract metadata
- `ai/theme.active.json` records workspace-selected theme state

RapidKit uses the standalone `rapidmcp` MCP server package.

For theme workflows, that server can expose active theme state, theme registry metadata, and theme contract details without requiring tools to inspect the repository manually.

Run it with:

```bash
pnpm --dir ../rapidmcp mcp:start -- --root "$PWD"
```

For a broader overview of the MCP surface, see `docs/MCP-SERVER.md`.

Recommended release checks:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm test
pnpm build
```

## Consumer Packaging Notes

Published consumers usually import a concrete theme directly:

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';
```

`src/themes/active.css` is primarily a workspace/development convenience for switching themes locally.
