# UI Kit Workspace Copilot Instructions

## Purpose

- This workspace builds a standalone, reusable, publishable UI component kit.
- Treat all work as package engineering for external consumers.
- Assume a brand-new project baseline unless requirements explicitly state otherwise.

## Scope Guardrails

- Never add product-specific business logic to core components.
- Never couple components to any specific domain model, workflow, or backend contract.
- Never import from host app state containers, routing state, authentication modules, or feature service layers.
- Never assume host application branding, deployment setup, or environment variable conventions.

## Architecture Rules

- Keep core components presentational and data-source agnostic.
- Pass behavior and state through props, callbacks, and composition.
- Place host-specific integration in optional adapters, wrappers, or examples.
- Keep modules tree-shake friendly and side-effect free by default.

## Component Structure Rules

- Prefer one folder per component with colocated files.
- Use predictable file naming patterns:
  - `ComponentName.tsx` for implementation
  - `types.ts` for public types
  - `index.ts` for exports
  - Optional `styles.ts` for variant maps
  - Optional `helpers.ts` for local pure utilities
  - `ComponentName.test.tsx` for behavior tests
- Use barrel exports at component level and explicit package entrypoints at root.
- Keep internal-only helpers out of public exports unless intentionally documented.

## API Design Rules

- Prefer named exports for components, hooks, types, and utilities.
- Treat public prop signatures as stable contracts.
- Avoid unplanned breaking API changes.
- Design props to be domain-neutral and reusable across applications.
- Components are wrappers over shadcn library components
- Prefer neutral authorization naming in public props (for example, `accessRequirements` and `resolveAccess`) instead of policy-specific names.

## TypeScript Rules

- Use strict TypeScript with explicit prop and event types.
- Avoid `any` in public APIs unless unavoidable and documented.
- Keep public types discoverable and well named.

## Styling Rules

- Use a library-safe styling strategy with predictable override behavior.
- Favor deterministic class composition (for example, utility merge helpers) instead of ad hoc concatenation.
- Keep visual tokens package-owned and documented.
- Avoid hardcoded product branding in core primitives.

## Dependencies Rules

- Keep runtime dependencies minimal and justified.
- Use peer dependencies for `react` and `react-dom`.
- Prefer lightweight utility dependencies.
- Use headless primitive libraries only when they improve accessibility and maintenance.

## Shadcn Workflow Rules

- Use the local shadcn CLI workflow for UI primitives: `pnpm ui:add <component> --yes`.
- Keep generated shadcn primitives in `src/components/ui` and compose package components from those primitives.
- Keep `components.json`, `tailwind.config.ts`, `postcss.config.js`, and `src/styles.css` aligned with shadcn setup.
- Favor workspace-relative imports for internal modules unless path aliases are explicitly configured in TypeScript and bundler config.

## Interaction And State Rules

- Keep async fetching and business workflows outside core primitives.
- For permission, policy, or feature-flag behavior, use injectable props/callbacks rather than direct app integrations.
- Avoid hidden global state access inside component internals.
- Keep access checks injectable and optional so components remain usable in apps with different access-control systems.

## Accessibility Rules

- Ensure full keyboard interaction for interactive components.
- Provide correct roles, labels, focus handling, and aria attributes.
- Validate overlays, menus, dialogs, popovers, and form controls for assistive technology.

## Testing Rules

- Use behavior-first tests for components and hooks.
- Cover controlled and uncontrolled modes where relevant.
- Use interaction tests for keyboard and focus flows.
- Prefer explicit assertions over snapshots.
- Mock external adapters/dependencies at boundaries to keep unit tests deterministic.
- Standardize tests on Vitest with `happy-dom` and Testing Library.
- Treat Vitest as the default testing layer for component behavior, prop wiring, access-state logic, and rendering assertions.
- Use Playwright CT only as a targeted browser-confidence layer for interactions that are meaningfully browser-dependent, such as table selection/sorting, focus management, overlays, portals, or layout-sensitive integration.
- Do not add Playwright CT for simple render checks, prop forwarding, className assertions, or behavior already well-covered by Vitest unless there is a demonstrated browser-only regression risk.
- Avoid matcher assumptions that require additional setup unless that setup is committed (for example, prefer plain assertions when `jest-dom` is not configured).

## Packaging Rules

- Publish ESM output with type declarations.
- Maintain a clear exports map and intentional `sideEffects` metadata.
- Ensure consumers can use the package without repository-specific path aliases.
- Validate package quality with lint, type-check, tests, and build before release.

## Documentation Rules

- Treat consumer-facing docs as required deliverables, not optional follow-up.
- For every new public component, add a dedicated page in `docs/components/<component>.md`.
- Update `docs/components/README.md` to include the new component link.
- Keep `docs/COMPONENTS.md` as a stable compatibility entrypoint that points to the scalable docs structure.
- Ensure examples use package imports (`@tarikukebede/mezmer`) and documented theme imports.
- Keep component docs aligned with public props, access behavior, accessibility notes, and tested interaction guarantees.

## Release Checklist Commands

- Run `pnpm lint` before merging package changes.
- Run `pnpm tsc --noEmit` to validate public and internal TypeScript contracts.
- Run `pnpm test` for behavior verification.
- Run `pnpm test:ct` when the change touches browser-critical interactions or existing Playwright-covered surfaces.
- Run `pnpm build` before publishing to verify distributable output.
- If any command fails, treat the change as incomplete until the failure is resolved or explicitly documented.

## Release Rules

- Follow semantic versioning.
- Major: breaking API/behavior changes.
- Minor: backward-compatible features.
- Patch: backward-compatible fixes.
- Keep a changelog for all user-visible changes.

## Copilot Behavior

- Prefer reusable, portable, and framework-agnostic solutions.
- Reject suggestions that introduce host-app coupling into core modules.
- Ask for clarification only when API stability, accessibility, or publishability is ambiguous.
- Optimize for maintainability and consumer developer experience.

## AI-First Contract Workflow

- Treat this repository as dual-context: human-readable docs plus machine-readable contracts.
- Baseline human context lives in `README.md`, `docs/CONTRIBUTING.md`, and `docs/ARCHITECTURE.md`.
- Structured AI context lives under `ai/contracts`.
- Structured AI context is mandatory for AI-assisted implementation; do not proceed without applicable contract context.

## Enterprise AI Implementation Rules

- Before editing a component, read its contract entry in `ai/contracts/index.json` and the component contract file.
- Keep implementation, public types, and tests in sync with the contract states.
- Do not introduce product-specific assumptions into contract artifacts.
- Preserve stable public APIs; use additive changes by default.

## Required Component Delivery Set

For every new package component, include:

- `ComponentName.tsx`
- `types.ts`
- `index.ts`
- `ComponentName.test.tsx`
- `ai/contracts/components/<component>.contract.json`
- `docs/components/<component>.md`

Each component contract must define:

- public prop requirements
- permission and accessibility states
- interaction guarantees that are validated by tests

For every new package component, documentation updates must also include:

- a link entry in `docs/components/README.md`
- a consumer-facing usage example in `docs/components/<component>.md`

## New Component Completion Checklist

Every time a new public component is added, do not treat the work as complete until all of the following are done:

- create the component folder under `src/components/ComponentName`
- add the component implementation, public types, component barrel export, and behavior test
- add the component export to the package entrypoint in `src/index.ts`
- add the component entry to `ai/contracts/index.json` with the correct `name`, `contractPath`, `sourcePath`, and capability list
- add `ai/contracts/components/<component>.contract.json` and keep its component name, source path, capabilities, and test file paths aligned with the index entry
- add `docs/components/<component>.md` and add its link to `docs/components/README.md`
- ensure the docs include consumer usage, public props, accessibility behavior, and access-control behavior where applicable
- run `pnpm validate:contracts`
- run `pnpm validate:component-docs`
- run `pnpm test` for behavior coverage

If the component changes package exports, public API shape, or publishable output, also run `pnpm tsc --noEmit` and `pnpm build` before considering the task complete.
