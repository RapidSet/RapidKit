# @tarikukebede/mezmer

<img src="docs/assets/mezmer-icon.svg" alt="Mezmer icon" width="88" />

A reusable, publishable React UI component library focused on enterprise-safe APIs, accessibility, and AI-first contract-driven development.

## Table of Contents

- Overview
- Installation
- Peer Dependencies
- Quick Start
- Public API
- Styling
- Access Control Model
- AI-First Contract Workflow
- Project Structure
- Development
- Testing
- Release Checklist
- Contributing
- License

## Overview

Mezmer provides composable UI primitives and higher-level components for React applications.

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
- InputProps
- InputAccessMode
- InputAccessResolver
- version

### Input Props Summary

Required:

- name: string
- onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

Common optional props:

- type, label, value, error, helperText, required
- accessRequirements, resolveAccess
- all standard input attributes except overridden name/value/onChange/type behavior

## Styling

- Global package styles are shipped via styles.css.
- Import styles once in the consuming application entrypoint.
- Components are composed with local shadcn primitives and utility-based class composition.

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
