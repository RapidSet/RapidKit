# Contributing Guide

This package is a publishable, reusable UI component library. Contributions should preserve portability, API stability, and enterprise readiness.

## Scope And Guardrails

- Keep components presentational and data-source agnostic.
- Do not couple core components to host app routing, auth, state containers, or backend contracts.
- Keep public APIs domain-neutral and backward compatible by default.
- For authorization behavior, use injectable checks through `accessRequirements` and `resolveAccess`.

## AI-First Operating Model

The repository uses a dual-context model:

- Baseline context: human-readable docs in `README.md`, this file, and `.github/copilot-instructions.md`.
- Structured context: machine-readable contracts under `ai/contracts`.
- Required rule: structured context under `ai/contracts` must be present and consulted for all AI-assisted component work.

## Contract Workflow

1. Read `ai/contracts/index.json` before editing a component.
2. Read the component contract file in `ai/contracts/components`.
3. Keep implementation, public types, and tests aligned with contract states.
4. Update contract and tests together when behavior changes.

## Component Documentation Workflow

For every new public component:

1. Add a dedicated consumer doc page at `docs/components/<component>.md`.
2. Add the component link to `docs/components/README.md`.
3. Ensure the doc includes: purpose, import path, key props, access-control notes (if supported), accessibility notes, and at least one usage example.
4. Keep docs aligned with the component's public types and AI contract.

## Docs Site Workflow

- The published docs site runs on Nextra.
- Source docs remain under `docs/` for repository-facing content and are mirrored into the Nextra pages app under `pages/`.
- Sidebar navigation for component pages is controlled by `pages/components/_meta.ts`.
- Use `pnpm docs:dev` for local docs development and `pnpm docs:build` to export the static site to `out/`.

## Input Contract Snapshot

- Access behavior:
  - Missing `accessRequirements` or missing `resolveAccess`: input remains visible and editable unless explicitly disabled.
  - No view permission: component returns `null`.
  - View allowed and edit denied: input renders disabled.
  - Explicit `disabled` prop always keeps input disabled.
- Accessibility:
  - `aria-invalid="true"` when `error` exists.
  - Label is associated via `htmlFor` and input `id`.
- Interaction:
  - Input stops keydown propagation.
  - Consumer `onKeyDown` still executes after propagation is stopped.

## Quality Gates

Run these before merge or release:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm test
pnpm build
```

## Release Workflow

- The component library publishes from the repository root as `@rapidset/rapidkit`.
- The CLI publishes from `packages/create-rapidkit` as `@rapidset/rapidkit-cli`.
- Root package release automation is defined in `.github/workflows/semantic-release.yml` and ignores CLI-only changes.
- CLI release automation is defined in `.github/workflows/cli-release.yml` and triggers on changes under `packages/create-rapidkit/**`.
- Root release tags use `rapidkit-v<version>`.
- CLI release tags use `rapidkit-cli-v<version>`.
- Use `pnpm release:dry` to inspect the root package release path locally.
- Use `pnpm release:cli:dry` to inspect the CLI release path locally.

## Testing Strategy

- Use `pnpm test` as the default verification path for component behavior, public prop handling, access-control branches, and rendering assertions.
- Use `pnpm test:ct` only for browser-dependent interaction coverage. In this repository, Playwright CT exists to validate cases that benefit from a real browser runtime, not to duplicate Vitest coverage.
- Avoid adding Playwright tests for simple render checks, prop forwarding, static class assertions, or branches already covered in Vitest unless there is evidence that `happy-dom` is insufficient.
- When adding new Playwright coverage, prefer interactive primitives and integration-heavy components such as tables, dialogs, menus, popovers, focus-managed widgets, or other surfaces with real browser event or layout sensitivity.
