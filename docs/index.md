---
layout: home

hero:
  name: Mezmer
  text: AI-First Enterprise UI Kit
  tagline: A full-blown solution for AI agents to generate enterprise-grade React UI using proven patterns, contracts, and production safeguards.
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
  - title: MCP-Compatible Context
    details: Machine-readable contracts and deterministic repository conventions are designed for MCP-enabled agent workflows.
  - title: Enterprise Safeguards
    details: Stable APIs, access-control injection, accessibility requirements, and test-enforced behavior reduce risky generation paths.
  - title: Developer Friendly
    details: Human developers get portable components, clear docs, and a predictable architecture that pairs with AI-assisted workflows.
---

<div class="hero-constellation">
  <div class="hero-copy">
    <p class="hero-eyebrow">Enterprise AI UI Foundation</p>
    <h2>Proven tools converge into one contract-driven system</h2>
    <p>
      Mezmer brings together schema validation, state architecture, table primitives, design-system building blocks, and AI-ready contracts into a single enterprise UI foundation.
    </p>
  </div>

  <div class="constellation-stage" aria-label="Mezmer ecosystem diagram">
    <div class="orbit orbit-top orbit-shadcn">
      <span class="orbit-line" aria-hidden="true"></span>
      <div class="orbit-node">
        <img src="https://cdn.simpleicons.org/shadcnui/111111" alt="shadcn/ui" />
        <span>shadcn/ui</span>
      </div>
    </div>

    <div class="orbit orbit-right orbit-zod">
      <span class="orbit-line" aria-hidden="true"></span>
      <div class="orbit-node">
        <img src="https://cdn.simpleicons.org/zod/3E67B1" alt="Zod" />
        <span>Zod</span>
      </div>
    </div>

    <div class="orbit orbit-bottom-right orbit-tanstack">
      <span class="orbit-line" aria-hidden="true"></span>
      <div class="orbit-node">
        <img src="https://cdn.simpleicons.org/tanstack/FF4154" alt="TanStack" />
        <span>TanStack</span>
      </div>
    </div>

    <div class="orbit orbit-bottom-left orbit-redux">
      <span class="orbit-line" aria-hidden="true"></span>
      <div class="orbit-node">
        <img src="https://cdn.simpleicons.org/redux/764ABC" alt="Redux Toolkit" />
        <span>Redux Toolkit</span>
      </div>
    </div>

    <div class="orbit orbit-left orbit-rhf">
      <span class="orbit-line" aria-hidden="true"></span>
      <div class="orbit-node">
        <img src="https://cdn.simpleicons.org/reacthookform/EC5990" alt="React Hook Form" />
        <span>React Hook Form</span>
      </div>
    </div>

    <div class="orbit orbit-top-left orbit-tailwind">
      <span class="orbit-line" aria-hidden="true"></span>
      <div class="orbit-node">
        <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" />
        <span>Tailwind CSS</span>
      </div>
    </div>

    <div class="constellation-center">
      <div class="mezmer-core-ring">
        <div class="mezmer-core">
          <img src="/mezmer-icon.svg" alt="Mezmer icon" />
        </div>
      </div>
      <p>Mezmer</p>
    </div>

  </div>
</div>

<div class="mcp-callout">
  <p class="mcp-label">MCP Server Included</p>
  <h3>Repository-local MCP support ships with Mezmer</h3>
  <p>
    AI agents can query contracts, component docs, themes, and validation tools through the built-in MCP server instead of inferring behavior from raw files.
  </p>
  <div class="mcp-actions">
    <a class="mcp-link" href="/MCP-SERVER">Read MCP server docs</a>
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
.hero-constellation {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent) 0%, transparent 32%),
    radial-gradient(circle at 80% 15%, color-mix(in srgb, #06b6d4 10%, transparent) 0%, transparent 28%),
    linear-gradient(145deg, color-mix(in srgb, var(--vp-c-bg-soft) 90%, white 10%), var(--vp-c-bg-soft));
  display: grid;
  gap: 1.5rem;
}

.hero-copy {
  max-width: 52rem;
}

.hero-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-2);
  font-weight: 700;
}

.hero-copy h2 {
  margin: 0.35rem 0 0.55rem;
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  line-height: 1.05;
}

.hero-copy p:last-child {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1.02rem;
}

.constellation-stage {
  position: relative;
  min-height: 34rem;
  border-radius: 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at center, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent) 0%, transparent 27%),
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-bg) 85%, var(--vp-c-bg-soft) 15%), var(--vp-c-bg));
}

.orbit {
  position: absolute;
  width: 11.5rem;
  height: 4.75rem;
}

.orbit-node {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 100%;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 75%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg) 90%, transparent);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
}

.orbit-node img {
  width: 2rem;
  height: 2rem;
  flex: none;
}

.orbit-node span {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.15;
}

.orbit-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9rem;
  height: 2px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--vp-c-text-3) 20%, transparent), color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent));
  transform-origin: left center;
}

.orbit-top {
  top: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
}

.orbit-top .orbit-line {
  transform: rotate(90deg);
}

.orbit-right {
  top: 50%;
  right: 1.2rem;
  transform: translateY(-50%);
}

.orbit-right .orbit-line {
  transform: rotate(180deg);
}

.orbit-bottom-right {
  right: 3.3rem;
  bottom: 2rem;
}

.orbit-bottom-right .orbit-line {
  transform: rotate(214deg);
}

.orbit-bottom-left {
  left: 3.3rem;
  bottom: 2rem;
}

.orbit-bottom-left .orbit-line {
  transform: rotate(326deg);
}

.orbit-left {
  top: 50%;
  left: 1.2rem;
  transform: translateY(-50%);
}

.orbit-left .orbit-line {
  transform: rotate(0deg);
}

.orbit-top-left {
  top: 3.5rem;
  left: 2.2rem;
}

.orbit-top-left .orbit-line {
  transform: rotate(33deg);
}

.constellation-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.mezmer-core-ring {
  display: grid;
  place-items: center;
  width: 15rem;
  height: 15rem;
  border-radius: 999px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--vp-c-brand-1) 45%, white), color-mix(in srgb, #06b6d4 45%, white));
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.mezmer-core {
  display: grid;
  place-items: center;
  width: 11.5rem;
  height: 11.5rem;
  border-radius: 999px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--vp-c-bg) 96%, white 4%), var(--vp-c-bg-soft));
}

.mezmer-core img {
  width: 6rem;
  height: 6rem;
}

.constellation-center p {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.04em;
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
  .constellation-stage {
    min-height: auto;
    padding: 1rem;
    display: grid;
    gap: 1rem;
  }

  .constellation-center {
    position: static;
    transform: none;
    order: -1;
  }

  .mezmer-core-ring {
    width: 12rem;
    height: 12rem;
  }

  .mezmer-core {
    width: 9rem;
    height: 9rem;
  }

  .mezmer-core img {
    width: 4.8rem;
    height: 4.8rem;
  }

  .orbit {
    position: static;
    width: auto;
    height: auto;
    transform: none;
  }

  .orbit-line {
    display: none;
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
