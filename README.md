# @tarikukebede/mezmer

<img src="docs/assets/mezmer-icon.svg" alt="Mezmer icon" width="88" />

A full-blown, publishable React UI library built for AI-assisted enterprise delivery.

Mezmer combines proven tools and patterns so AI systems can generate consistent, production-grade code by default.

[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Primitives-111111)](https://ui.shadcn.com)
[![Zod](https://img.shields.io/badge/Zod-Schema%20Validation-3E67B1?logo=zod&logoColor=white)](https://zod.dev)
[![TanStack Table](https://img.shields.io/badge/TanStack-Table%20v8-FF4154?logo=tanstack&logoColor=white)](https://tanstack.com/table)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-State%20Architecture-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-Form%20State-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Peer Dependencies](#peer-dependencies)
- [Quick Start](#quick-start)
- [Public API](#public-api)
- [Component Docs](https://tarikukebede.github.io/mezmer/components/)
- [Styling](#styling)
- [Theming Guide](docs/THEMING.md)
- [Theme Configuration](docs/THEME-CONFIGURATION.md)
- [MCP Server](#mcp-server)
- [Architecture](docs/ARCHITECTURE.md)
- [Access Control Model](#access-control-model)
- [AI-First Contract Workflow](#ai-first-contract-workflow)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Release Checklist](#release-checklist)
- [Contributing](docs/CONTRIBUTING.md)
- [License](#license)

## Overview

Mezmer provides predefined, composable UI templates and higher-level components for React applications.

It is intentionally assembled from multiple mature libraries (including shadcn/ui, TanStack Table, Redux Toolkit, React Hook Form, Zod, and Lucide) so AI systems and developers can produce production-ready code with consistent safeguards.

Core goals:

- Stable and domain-neutral component APIs
- Accessibility-first behavior
- Tree-shake-friendly library exports
- Contract-aligned implementation for deterministic AI-assisted development

## Installation

Install the package and required peers:

```bash
pnpm add @tarikukebede/mezmer @reduxjs/toolkit @tanstack/react-table react react-dom react-hook-form react-redux zod tailwindcss
```

## Peer Dependencies

This package expects the following peer dependencies in consumer applications:

- react: ^18.0.0 || ^19.0.0
- react-dom: ^18.0.0 || ^19.0.0
- @reduxjs/toolkit: ^2.0.0
- @tanstack/react-table: ^8.0.0
- react-hook-form: ^7.0.0
- react-redux: ^9.0.0
- zod: ^3.0.0
- tailwindcss: ^3.0.0 || ^4.0.0

## Quick Start

```tsx
import { Input } from '@tarikukebede/mezmer';
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/default.css';

function Example() {
  return (
    <Input
      name="email"
      label="Email"
      value=""
      onChange={() => {}}
      placeholder="name@company.com"
    />
  );
}
```

## Public API

Current root exports:

- Input
- Checkbox
- Icon
- Image
- BaseTable
- Chip
- Button
- version

Type exports are also available from each component module (for example, `InputProps`, `CheckBoxProps`, `ChipProps`, and `ButtonProps`).

For consumer-facing props, examples, and behavior notes for every exported component, see https://tarikukebede.github.io/mezmer/components/.

`docs/COMPONENTS.md` remains as a stable compatibility entrypoint that forwards to the scalable per-component docs structure.

## Styling

- Global package styles are shipped via `styles.css`.
- Pre-built themes are shipped via `themes/default.css` and `themes/slate.css`.
- Import base styles once, then import exactly one built-in theme (or your custom theme) after it.
- Components remain semantic-token driven so host apps can override tokens without changing component code.

### Theme Commands (AI-Friendly)

List available themes in machine-readable JSON:

```bash
pnpm theme:list
```

Switch the active theme used by the library workspace:

```bash
pnpm theme:apply --theme default
pnpm theme:apply --theme slate --mode dark
```

Scaffold a new custom theme from an existing base theme:

```bash
pnpm theme:create --id brand-x --from default
```

Theme metadata and active selection are stored in `ai/contracts/themes/*` and `ai/theme.active.json` for deterministic AI workflows.

For workspace-level setup, generated files, and runtime mode behavior, see `docs/THEME-CONFIGURATION.md`.

## MCP Server

This repository now includes a local MCP server implementation for AI tooling.

Purpose:

- expose component and theme contracts as structured MCP resources
- expose component docs as readable MCP resources
- provide validation tools that wrap existing repository validators

Start the stdio MCP server:

```bash
pnpm mcp:server
```

Show help text:

```bash
pnpm mcp:help
```

The server entrypoint is `scripts/mcp-server.mjs`.

## Access Control Model

Input authorization is injectable and domain-neutral:

- If accessRequirements is missing, or resolveAccess is not provided, the component is visible and editable (unless disabled is set).
- If view permission is denied, the component renders null.
- If view is allowed and edit is denied, the input renders disabled.
- Explicit disabled always enforces disabled state.

## AI-First Contract Workflow

This repository uses a dual-context model:

- Baseline docs: this README, docs/CONTRIBUTING.md, docs/ARCHITECTURE.md, and .github/copilot-instructions.md
- Structured contracts: ai/contracts/index.json and component contract files

Structured context is mandatory for AI-assisted implementation. Do not proceed with component changes without applicable contract context.

## Project Structure

```text
src/
  index.ts
  styles.css
  components/
    Input/
      Input.tsx
      types.ts
      index.ts
      Input.test.tsx
  components/ui/
    input.tsx
    label.tsx
ai/contracts/
  index.json
  components/
    input.contract.json
docs/
  CONTRIBUTING.md
  ARCHITECTURE.md
  THEME-CONFIGURATION.md
```

## Development

```bash
pnpm install
pnpm dev
```

Useful scripts:

- pnpm lint
- pnpm lint:fix
- pnpm tsc --noEmit
- pnpm test
- pnpm build
- pnpm validate:contracts
- pnpm docs:dev
- pnpm docs:build

## Testing

Unit tests:

```bash
pnpm test
```

Component tests:

```bash
pnpm playwright:install
pnpm test:ct
```

Playwright is intentionally narrow in this repository. Use it for browser-dependent interaction coverage, not as a second unit-test layer.

- Default to Vitest for component behavior, prop wiring, access-state logic, and rendering assertions.
- Use Playwright CT for browser-critical behavior such as table interaction, focus management, overlays, portals, and other integration paths that benefit from a real browser runtime.
- Avoid adding Playwright tests that only repeat simple render checks, class assertions, or prop forwarding already covered by Vitest.

For full cross-browser coverage:

```bash
pnpm playwright:install:all
```

## Release Checklist

Run before release:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm test
pnpm build
```

## Contributing

See docs/CONTRIBUTING.md for scope guardrails, contract workflow, and quality gates.

## License

MIT
