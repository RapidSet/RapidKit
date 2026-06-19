# RapidKit Claude Code Instructions

## What this repo is

- `@rapidset/rapidkit` — an AI-first, publishable React UI component library for production-grade enterprise apps. Built on shadcn/ui, Radix UI, TanStack Table v8, Redux Toolkit, React Hook Form, Zod, and Tailwind CSS.
- Dual project in one package: a library bundle (Vite → `dist/`) and a Nextra docs site (Next.js 15 → `out/`). Single package, no workspaces.
- Package manager: **pnpm 9.15.1** (pinned). Tested on Node **20.19** and **22.12**.
- Public surface lives in `src/index.ts` — 20 components, 3 hooks (`useDebounce`, `useFormHandlers`, `useSearchPagination`), access-control utilities, and `pagination`.
- AI contracts live in `ai/contracts/`. They are mandatory machine-readable context for AI-assisted work and are validated before publish.

## Common commands

- Library dev: `pnpm dev` — Vite dev server for the library.
- Docs dev: `pnpm docs:dev` — Nextra dev server (clears `.next` first).
- Library build: `pnpm build` — Vite library build, then copy theme assets to `dist/themes/`.
- Docs build: `pnpm docs:build` — static Next.js export to `out/`.
- Unit tests: `pnpm test` (one-shot) or `pnpm test:watch` (Vitest, happy-dom).
- Component tests: `pnpm test:ct` (Playwright CT). Headed: `pnpm test:ct:headed`. UI mode: `pnpm test:ct:ui`.
- Lint: `pnpm lint` — `src` + docs, zero-warning policy. Autofix: `pnpm lint:fix`.
- Type check: `pnpm tsc --noEmit`.
- Format: `pnpm format` / `pnpm format:check`.
- Contracts/docs validation: `pnpm validate:contracts`, `pnpm validate:component-docs`.
- Themes: `pnpm theme:list`, `pnpm theme:apply`, `pnpm theme:create`.
- Release: `pnpm changeset` (create), `pnpm version-packages`, `pnpm release` (publishes via Changesets). `pnpm release:dry` to inspect status.
- Full pre-publish gate: `pnpm prepublishOnly` runs `validate:contracts → validate:component-docs → lint → tsc --noEmit → test → build`.
- shadcn primitives: `pnpm ui:add <component> --yes`.

## Purpose

- Treat all work as package engineering for external consumers.
- Assume a brand-new project baseline unless requirements explicitly state otherwise.
- This project currently has no production users; do not prioritize backward compatibility when making improvements.

## Scope Guardrails

- Never add product-specific business logic to core components.
- Never couple components to any specific domain model, workflow, or backend contract.
- Never import from host app state containers, routing state, authentication modules, or feature service layers.
- Never assume host application branding, deployment setup, or environment variable conventions.

## Architecture Rules

- Keep core components presentational and data-source agnostic.
- Pass behavior and state through props, callbacks, and composition.
- Place host-specific integration in optional adapters, wrappers, or examples.
- Keep modules tree-shake friendly and side-effect free by default (note: `package.json` declares `sideEffects: ["**/*.css"]` — keep that intact).

## Component Structure Rules

- One folder per component with colocated files under `src/components/ComponentName/` (PascalCase folder).
- Predictable file naming:
  - `ComponentName.tsx` — implementation
  - `types.ts` — public types
  - `index.ts` — barrel exports
  - Optional `styles.ts` — variant maps (CVA)
  - Optional `helpers.ts` — local pure utilities, including access resolvers
  - `ComponentName.test.tsx` — behavior tests
- Use barrel exports at component level and add the component export to `src/index.ts`.
- Keep internal-only helpers out of public exports unless intentionally documented.

## API Design Rules

- Prefer named exports for components, hooks, types, and utilities.
- Favor clear, correct API design over backward compatibility constraints during this early project phase.
- Design props to be domain-neutral and reusable across applications.
- Components wrap shadcn primitives — public props belong on the wrapper, not on the primitive.
- Prefer neutral authorization naming in public props (e.g., `accessRequirements`, `resolveAccess`) instead of policy-specific names.

## TypeScript Rules

- Use strict TypeScript with explicit prop and event types.
- Avoid `any` in public APIs unless unavoidable and documented.
- Keep public types discoverable and well named.

## Styling Rules

- Use a library-safe styling strategy with predictable override behavior.
- Favor deterministic class composition (e.g., `clsx` + `tailwind-merge`) over ad hoc concatenation.
- Keep visual tokens package-owned and documented; themes live in `src/themes/` as CSS variable layers.
- Avoid hardcoded product branding in core primitives.

## Dependencies Rules

- Keep runtime dependencies minimal and justified.
- Use peer dependencies for `react`, `react-dom`, `@reduxjs/toolkit`, `@tanstack/react-table`, `react-redux`, `react-hook-form`, `tailwindcss`, and `zod`.
- Prefer lightweight utility dependencies; use headless primitive libraries (Radix) only when they improve accessibility and maintenance.

## Shadcn Workflow Rules

- Use the local shadcn CLI for UI primitives: `pnpm ui:add <component> --yes`.
- Keep generated shadcn primitives in `src/components/ui` and compose package components from those primitives.
- Treat files in `src/components/ui` as generated sources: do not add package-specific styling, behavior, or business rules there unless the user explicitly asks to modify the generated primitive.
- Apply package customization at the component layer (`src/components/ComponentName/ComponentName.tsx` via props, `className`, `classNames`, wrappers, and helpers) so future shadcn installs do not erase custom code.
- If a shadcn add/update would overwrite local customizations in `src/components/ui`, stop and move them into component-level wrappers first.
- Keep `components.json`, `tailwind.config.ts`, `postcss.config.js`, and `src/styles.css` aligned with shadcn setup.

## Interaction And State Rules

- Keep async fetching and business workflows outside core primitives.
- For permission, policy, or feature-flag behavior, use injectable props/callbacks rather than direct app integrations.
- Avoid hidden global state access inside component internals.
- Keep access checks injectable and optional so components remain usable in apps with different access-control systems. The repo's own pattern: `RapidKitAccessProvider` + `useAccessResolver` + per-component `resolveXAccessState` helpers.

## Accessibility Rules

- Ensure full keyboard interaction for interactive components.
- Provide correct roles, labels, focus handling, and aria attributes.
- Validate overlays, menus, dialogs, popovers, and form controls for assistive technology.

## Testing Rules

- Behavior-first tests for components and hooks; cover controlled and uncontrolled modes where relevant.
- Use interaction tests for keyboard and focus flows; prefer explicit assertions over snapshots.
- Mock external adapters/dependencies at boundaries to keep unit tests deterministic.
- Standardize unit tests on **Vitest** with `happy-dom` and Testing Library. Unit tests live colocated as `src/**/*.test.{ts,tsx}`.
- Use **Playwright CT** only as a targeted browser-confidence layer for interactions that are meaningfully browser-dependent (table selection/sorting, focus management, overlays, portals, layout-sensitive integration). Lives in `tests/ct/*.ct.spec.tsx`.
- Do not add Playwright CT for simple render checks, prop forwarding, className assertions, or behavior already well-covered by Vitest unless there is demonstrated browser-only regression risk.
- Avoid matcher assumptions that require additional setup unless that setup is committed (e.g., prefer plain assertions when `jest-dom` is not configured).
- **CI runs more than `prepublishOnly`.** The `prepublishOnly` gate (`validate:contracts → validate:component-docs → lint → tsc → test → build`) does NOT include `pnpm test:ct`, but `changesets.yml` runs the Playwright CT suite as a separate required job. Before pushing any change that touches a component, run `pnpm test:ct` locally (after `pnpm playwright:install`) so a browser-only regression is caught before CI, not after.
- The focus-ring assertions in `tests/ct/ControlBorders.ct.spec.tsx` (Input/DropDown border shifts to ring color on focus) are timing- and focus-sensitive and flake intermittently in headless CI. A CT failure on a PR that changed no source (e.g. the auto `chore: version packages` PR) is almost always this flake: re-run the failed job rather than treating it as a regression.

## Packaging Rules

- Publish ESM output with type declarations.
- Maintain a clear exports map and intentional `sideEffects` metadata.
- Ensure consumers can use the package without repository-specific path aliases.
- Validate package quality with lint, type-check, tests, and build before release (see `prepublishOnly`).

## Documentation Rules

- Treat consumer-facing docs as required deliverables, not optional follow-up.
- For every new public component, add a dedicated page in `docs/components/<component>.md`.
- Update `docs/components/README.md` to include the new component link (alphabetical A-Z).
- Keep `docs/COMPONENTS.md` as a stable compatibility entrypoint that points to the scalable docs structure.
- Ensure examples use package imports (`@rapidset/rapidkit`) and the documented theme imports (`@rapidset/rapidkit/styles.css` + `@rapidset/rapidkit/themes/<name>.css`). Never document deep imports.
- Keep component docs aligned with public props, access behavior, accessibility notes, and tested interaction guarantees.
- For all flow docs pages (not only login), make route links and `/preview/flows/<flow>/` iframe sources base-path aware for GitHub Pages by resolving paths with `NEXT_PUBLIC_BASE_PATH` instead of hardcoded root-relative URLs.

## Release Rules

- Releases are managed by **Changesets** (`.changeset/`). Any user-visible change needs an accompanying changeset.
- Follow semantic versioning: major = breaking API/behavior; minor = backward-compatible features; patch = backward-compatible fixes.
- Keep `CHANGELOG.md` up to date for all user-visible changes (Changesets handles this automatically).
- `.github/workflows/changesets.yml` opens the release PR from `main` and publishes to npm with provenance on merge.
- **A feature branch carries code + the changeset `.md` only.** Run `pnpm changeset` to author it and commit it with your change. Do NOT bump the version yourself: never run `pnpm version-packages` / `changeset version`, never hand-edit the `version` in `package.json`, and never write the `CHANGELOG.md` entry manually. Those are the automation's job, and pre-doing them means the release PR is never opened and the normal review step is skipped.
- The flow after merge to `main`: `changesets/action@v1` opens (or updates) a `chore: version packages` PR on the `changeset-release/main` branch that consumes pending changesets, bumps the version, and writes the changelog. Merging THAT PR runs `pnpm release` (`changeset publish`) and publishes to npm. `pnpm version-packages` and `pnpm release` are CI-only commands; do not run them locally.
- The version bump aggregates every pending changeset, so the published version may be higher than your single changeset implies (e.g. another merged change already queued a bump). Read the `chore: version packages` PR to learn the actual version that will publish.

## AI-First Contract Workflow

- Treat this repository as dual-context: human-readable docs plus machine-readable contracts.
- Baseline human context lives in `README.md`, `docs/CONTRIBUTING.md`, and `docs/ARCHITECTURE.md`.
- Structured AI context lives under `ai/contracts/` (index at `ai/contracts/index.json`).
- Structured AI context is mandatory for AI-assisted implementation; do not proceed without applicable contract context.

## Enterprise AI Implementation Rules

- Before editing a component, read its entry in `ai/contracts/index.json` and the component contract file.
- Keep implementation, public types, and tests in sync with the contract states.
- Do not introduce product-specific assumptions into contract artifacts.
- Preserve stable public APIs; use additive changes by default.

## Required Component Delivery Set

For every new package component, include:

- `ComponentName.tsx`
- `types.ts`
- `index.ts`
- `styles.ts` (when the component has public variants or style maps)
- `helpers.ts` (when access resolution or pure local helpers are needed)
- `ComponentName.test.tsx`
- `ai/contracts/components/<component>.contract.json` (with public prop requirements, permission and accessibility states, and interaction guarantees validated by tests)
- `docs/components/<component>.md` (consumer-facing usage example)
- Link entry in `docs/components/README.md` (alphabetical A-Z)

## New Component Completion Checklist

Every time a new public component is added, do not treat the work as complete until all of the following are done:

- Create the component folder under `src/components/ComponentName` using PascalCase folder naming only.
- Add the component implementation, public types, component barrel export, and behavior test.
- Add `styles.ts` when public variants or class maps are part of the component contract.
- Add `helpers.ts` when access resolution or pure local utilities are needed.
- Keep file casing and imports consistent so the workspace never mixes `ComponentName` and `componentName` paths.
- Add or update any required shadcn/ui primitive wrappers under `src/components/ui`, keeping the styling setup aligned with `components.json`, `tailwind.config.ts`, `postcss.config.js`, and `src/styles.css` when the primitive surface changes.
- Ensure the component uses package-owned semantic tokens or shared primitives instead of product-specific colors or branding.
- Add the component export to `src/index.ts`.
- Add the component entry to `ai/contracts/index.json` with the correct `name`, `contractPath`, `sourcePath`, and capability list.
- Add `ai/contracts/components/<component>.contract.json` and keep its component name, source path, capabilities, prop metadata, states, interaction guarantees, and test file paths aligned with the index entry.
- Add `docs/components/<component>.md` and add its link to `docs/components/README.md` in alphabetical A-Z order.
- Add the component link to `docs/components/index.md` and `docs/COMPONENTS.md` in alphabetical A-Z order.
- Add the component to the root API list in `README.md` when publicly exported.
- Ensure the docs include consumer usage, public props, accessibility behavior, tested interaction guarantees, and access-control behavior where applicable.
- Update `pages/components/_meta.ts` so the component appears in the Nextra docs sidebar in alphabetical A-Z order.
- Run `pnpm docs:build` and verify the generated docs site includes the new component page and navigation entry before treating GitHub Pages coverage as complete.
- Run `pnpm validate:contracts`.
- Run `pnpm validate:component-docs`.
- Run `pnpm lint`.
- Run `pnpm tsc --noEmit`.
- Run `pnpm test` for behavior coverage.
- Run `pnpm test:ct` when the component has browser-dependent interaction that merits Playwright coverage.
- Run `pnpm --dir ../rapidmcp mcp:start -- --root "$PWD"` and verify MCP `list_components` returns the new component and its docs/contract are discoverable from the index-driven MCP surface.
- Run `pnpm build` when the component changes package exports, public API shape, styles, or publishable output.

If any item above is skipped, explicitly document why it was not required or could not be completed before considering the component work done.

## Claude Behavior

- Prefer reusable, portable, framework-agnostic solutions; reject suggestions that introduce host-app coupling into core modules.
- Optimize for maintainability and consumer developer experience.
- When in doubt, see `.github/copilot-instructions.md` (source of truth for AI-agent guidance — keep CLAUDE.md in sync with it), `docs/ARCHITECTURE.md`, `docs/CONTRIBUTING.md`, and the public docs at https://rapidset.github.io/RapidKit/.
