# Theme Configuration Guide

This guide explains how theme selection, theme files, and runtime mode behavior are configured in this library workspace.

## Scope

Use this document for:

- selecting and switching workspace themes
- understanding generated files and configuration state
- scaffolding a custom theme
- validating theme contracts

This guide also covers how theming is validated in CI for AI-first workflows.

For token definitions and consumer import examples, see `docs/THEMING.md`.

## Configuration Files

- `ai/contracts/index.json`: source of truth for available theme entries (`id`, `contractPath`, `cssPath`).
- `ai/contracts/themes/*.contract.json`: contract metadata for each theme.
- `ai/theme.schema.json`: JSON schema that validates theme contract structure.
- `ai/theme.active.json`: current workspace-selected theme and preferred mode metadata.
- `src/themes/active.css`: generated import file that points to the selected theme stylesheet.
- `src/themes/default.css`, `src/themes/slate.css`: built-in theme token files.

## Theme Selection Flow

1. Run `pnpm theme:list` to inspect available themes from contracts.
2. Run `pnpm theme:apply --theme <theme-id> [--mode light|dark|system]`.
3. The script updates:
   - `src/themes/active.css` to import the selected `src/themes/<id>.css`
   - `ai/theme.active.json` with `themeId`, `mode`, and `updatedAt`
4. Components pick up tokens via `src/styles.css` and Tailwind semantic utilities.

## Runtime Mode Behavior

`--mode` is stored as workspace metadata in `ai/theme.active.json`.

It does not automatically apply `.dark` at runtime. Dark mode still depends on your runtime class strategy (Tailwind `darkMode: ['class']`), so the host app or preview shell must control the `.dark` class.

## Create A Custom Theme

Run:

```bash
pnpm theme:create --id brand-x --from default
```

This scaffolds:

- `src/themes/brand-x.css`
- `ai/contracts/themes/brand-x-theme.contract.json`
- a `themes` entry in `ai/contracts/index.json`

After creation, apply it with:

```bash
pnpm theme:apply --theme brand-x
```

## Validation And Quality Gates

Run contract validation after theme changes:

```bash
pnpm validate:contracts
```

Theme-related CI checks in `.github/workflows/ci.yml` include:

- `pnpm theme:list` to ensure registry metadata remains readable
- `pnpm test:scripts` to verify theme script integration behavior
- `pnpm validate:contracts` to confirm theme contract/index consistency
- standard lint/type/test/build quality gates before release

Docs publishing CI in `.github/workflows/docs-deploy.yml` builds VitePress and deploys documentation to GitHub Pages on `main`.

## AI Context And MCP Compatibility

Theme metadata is intentionally machine-readable for AI systems:

- `ai/contracts/index.json` provides the theme registry
- `ai/contracts/themes/*.contract.json` defines theme contract metadata
- `ai/theme.active.json` records workspace-selected theme state

Mezmer does not currently include a standalone MCP server. The repository structure is designed so MCP-enabled agents can consume these files directly as structured context.

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
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/default.css';
```

`src/themes/active.css` is primarily a workspace/development convenience for switching themes locally.
