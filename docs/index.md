---
layout: home

hero:
  name: Mezmer
  text: AI-First Enterprise UI Kit
  tagline: A full-blown solution for AI agents to generate enterprise-grade React UI using proven patterns, contracts, and production safeguards.
  image:
    src: /mezmer-hero-ecosystem.svg
    alt: Mezmer ecosystem
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
---

<div class="mcp-callout">
  <p class="mcp-label">MCP Server Included</p>
  <h3>Repository-local MCP support ships with Mezmer</h3>
  <p>
    AI agents can query contracts, component docs, themes, and validation tools through the built-in MCP server instead of inferring behavior from raw files.
  </p>
  <div class="mcp-actions">
    <a class="mcp-link" href="MCP-SERVER">Read MCP server docs</a>
    <code>pnpm mcp:server</code>
  </div>
</div>

<div class="tooling-hero">
  <p class="tooling-eyebrow">Built With Proven Tools</p>
  <h2>Production stack, made explicit for AI and humans</h2>
  <p>
    Mezmer combines battle-tested libraries so generated code starts from enterprise-ready defaults instead of ad hoc implementation choices.
  </p>
  <div class="tooling-badges">
    <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/shadcn%2Fui-Primitives-111111" alt="shadcn/ui" />
    </a>
    <a href="https://zod.dev" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/Zod-Schema%20Validation-3E67B1?logo=zod&logoColor=white" alt="Zod" />
    </a>
    <a href="https://tanstack.com/table" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/TanStack-Table%20v8-FF4154?logo=tanstack&logoColor=white" alt="TanStack Table" />
    </a>
    <a href="https://redux-toolkit.js.org" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/Redux%20Toolkit-State%20Architecture-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit" />
    </a>
    <a href="https://react-hook-form.com" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/React%20Hook%20Form-Form%20State-EC5990?logo=reacthookform&logoColor=white" alt="React Hook Form" />
    </a>
    <a href="https://react.dev" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/React-UI%20Runtime-149ECA?logo=react&logoColor=white" alt="React" />
    </a>
    <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/TypeScript-Strict%20Contracts-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/Tailwind%20CSS-Tokenized%20Styling-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    </a>
  </div>
</div>

## Why Mezmer Exists

Mezmer was primarily designed for AI-assisted software delivery.

It is a predefined template system for enterprise UI delivery, not just a loose collection of isolated components.

The goal is to let AI tools generate production-ready UI code by default using:

- predefined component contracts
- reusable, domain-neutral APIs
- injectable authorization patterns
- accessibility-aware component behavior
- test-backed interaction guarantees

Developers can still use Mezmer directly like any modern React component library, but the architecture is intentionally optimized for AI + developer collaboration.

## Template-First Foundation

Mezmer combines proven open-source libraries into a single, contract-driven template layer so generated code is production-oriented from the start.

This reduces ad hoc implementation differences and helps AI agents apply consistent patterns across projects.

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

Mezmer is built for MCP-enabled AI workflows and now ships a repository-local MCP server.

The server exposes:

- component and theme contracts as structured resources
- component docs as readable resources
- contract/docs validation tools for guardrail checks

Run it locally with `pnpm mcp:server` from the project root.

The implementation intentionally stays thin and delegates core validation logic to existing scripts so behavior remains consistent with the repository's source-of-truth checks.

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

Mezmer is built on a pragmatic stack centered on React, TypeScript, shadcn/ui, Zod, TanStack Table, Redux Toolkit, React Hook Form, and Tailwind CSS.

For the complete toolchain and each library's architectural role, see [Technology Stack](/ARCHITECTURE#technology-stack).

<style scoped>
:global(.VPHero.has-image .container) {
  align-items: center;
}

:global(.VPHero.has-image .image) {
  transform: none;
}

:global(.VPHero.has-image .image-container) {
  width: min(42rem, 48vw);
  height: auto;
}

:global(.VPHero.has-image .image-bg) {
  width: 100%;
  height: 100%;
  transform: none;
  filter: blur(72px);
}

:global(.VPHero.has-image .image-src) {
  width: 100%;
  max-width: 42rem;
  height: auto;
}

.mcp-callout {
  margin: 0 0 1.5rem;
  padding: 1.1rem 1.25rem;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 25%, var(--vp-c-divider));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-soft) 50%, transparent), transparent),
    var(--vp-c-bg-soft);
}

.mcp-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.mcp-callout h3 {
  margin: 0.35rem 0 0.45rem;
  font-size: 1.15rem;
}

.mcp-callout p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.mcp-actions {
  margin-top: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.mcp-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.mcp-actions code {
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: var(--vp-code-block-bg);
}

.tooling-hero {
  margin: 1.5rem 0 2rem;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent) 0%, transparent 48%),
    linear-gradient(140deg, color-mix(in srgb, var(--vp-c-bg-soft) 92%, var(--vp-c-brand-soft) 8%), var(--vp-c-bg-soft));
}

.tooling-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-2);
  font-weight: 700;
}

.tooling-hero h2 {
  margin: 0.35rem 0 0.5rem;
  font-size: 1.35rem;
}

.tooling-hero p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.tooling-badges {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.tooling-badges img {
  display: block;
}

@media (max-width: 820px) {
  :global(.VPHero.has-image .image-container) {
    width: min(28rem, 100%);
  }
}
</style>

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
