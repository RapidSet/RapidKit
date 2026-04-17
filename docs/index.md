---
layout: home

hero:
  name: Mezmer
  text: AI-First Enterprise UI Component Library
  tagline: Built for AI agents to generate consistent, enterprise-grade React UI code with predefined patterns, safeguards, and contracts.
  image:
    src: /mezmer-icon.svg
    alt: Mezmer icon
  actions:
    - theme: brand
      text: AI Workflow
      link: /ARCHITECTURE
    - theme: alt
      text: Component Docs
      link: /components/
    - theme: alt
      text: Theming
      link: /THEMING

features:
  - title: AI-Ready By Design
    details: Components, contracts, and docs are structured so AI agents can produce deterministic, high-quality UI code.
  - title: Enterprise Safeguards
    details: Stable APIs, access-control injection, accessibility requirements, and test-enforced behavior reduce risky generation paths.
  - title: Developer Friendly
    details: Human developers get portable components, clear docs, and a predictable architecture that pairs with AI-assisted workflows.
---

## Why Mezmer Exists

Mezmer was primarily designed for AI-assisted software delivery.

The goal is to let AI tools generate production-ready UI code by default using:

- predefined component contracts
- reusable, domain-neutral APIs
- injectable authorization patterns
- accessibility-aware component behavior
- test-backed interaction guarantees

Developers can still use Mezmer directly like any modern React component library, but the architecture is intentionally optimized for AI + developer collaboration.

## AI Setup In This Library

Mezmer provides two context layers so AI systems can reliably generate code:

- Human-readable guidance in docs and workspace instructions
- Structured contracts in `ai/contracts` for deterministic behavior and validation

AI workflows are anchored by:

- `ai/contracts/index.json` as the registry for components and themes
- per-component contracts in `ai/contracts/components/*.contract.json`
- theme contracts in `ai/contracts/themes/*.contract.json`
- validation scripts and CI checks that enforce contract + docs consistency

## MCP Positioning

Mezmer does not currently ship a standalone MCP server implementation.

Instead, it is designed to be MCP-friendly by exposing machine-readable contract files and predictable repository conventions that MCP-enabled agents can consume as structured context.

In practice, this means MCP clients can inspect contract metadata and generate code that stays aligned with required props, states, accessibility expectations, and theming contracts.

## Enterprise Guardrails

Mezmer bakes in practices commonly required in enterprise environments:

- contract-driven implementation and change control
- access checks via `accessRequirements` and `resolveAccess`
- consistent file/component structure for maintainability
- explicit testing expectations for behavior and accessibility
- token-driven theming with predictable overrides

## Install

```bash
pnpm add @tarikukebede/mezmer
```

## Use

```tsx
import { Input } from '@tarikukebede/mezmer';
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/default.css';

export function Example() {
  return <Input name="email" value="" onChange={() => {}} />;
}
```

## Built On

Mezmer is built on a pragmatic stack that supports AI-first and enterprise-grade delivery:

- React 18/19
- TypeScript
- shadcn/ui primitives
- Tailwind CSS
- Radix UI primitives
- Lucide icons
- TanStack Table
- Redux Toolkit and React Redux
- React Hook Form
- Zod

## Automation And CI

The library is continuously validated for AI and developer workflows:

- contracts validation via `pnpm validate:contracts`
- component docs coverage validation via `pnpm validate:component-docs`
- theme command verification via `pnpm theme:list`
- theme integration checks via `pnpm test:scripts`
- docs site deployment to GitHub Pages via the docs deploy workflow

## Learn More

- [Component Documentation](/components/)
- [Theming Guide](/THEMING)
- [Architecture](/ARCHITECTURE)
- [Contributing](/CONTRIBUTING)
