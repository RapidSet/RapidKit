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

## Interaction And State Rules

- Keep async fetching and business workflows outside core primitives.
- For permission, policy, or feature-flag behavior, use injectable props/callbacks rather than direct app integrations.
- Avoid hidden global state access inside component internals.

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

## Packaging Rules

- Publish ESM output with type declarations.
- Maintain a clear exports map and intentional `sideEffects` metadata.
- Ensure consumers can use the package without repository-specific path aliases.
- Validate package quality with lint, type-check, tests, and build before release.

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
