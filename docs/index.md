---
layout: home

hero:
  name: Mezmer
  text: Contract-Driven React UI Kit
  tagline: Minimal API surface. Strong defaults. Enterprise-ready patterns for AI and humans.
  image:
    src: /mezmer-hero-ecosystem.svg
    alt: Mezmer ecosystem
  actions:
    - theme: brand
      text: Get Started
      link: /INSTALLATION
    - theme: alt
      text: Components
      link: /components/
    - theme: alt
      text: Architecture
      link: /ARCHITECTURE
    - theme: alt
      text: MCP Server
      link: /MCP-SERVER

features:
  - icon: <>
    title: Contract First
    details: Every public component is backed by machine-readable contracts to keep API, docs, and behavior aligned.
  - icon: a11y
    title: Accessible By Default
    details: Keyboard support, role semantics, and interaction guarantees are expected and tested.
  - icon: paintbrush
    title: Theme Ready
    details: Token-driven styling with predictable overrides and multiple packaged themes.
  - icon: robot
    title: AI Workflow Native
    details: Built for agent-assisted delivery with structure and validation, not prompt-only conventions.
  - icon: flask
    title: Test Backed
    details: Vitest plus targeted component testing workflows keep behavior stable during changes.
  - icon: package
    title: Publishable Library
    details: ESM output, typed APIs, and explicit package boundaries for real-world consumer apps.
---

<section class="landing-shell">
  <div class="landing-grid">
    <article class="landing-card landing-card--primary">
      <p class="landing-eyebrow">Quick Install</p>
      <pre><code>pnpm add @tarikukebede/mezmer</code></pre>
      <p>Import once and start composing with typed, reusable components.</p>
      <div class="landing-links">
        <a href="/INSTALLATION">Installation</a>
        <a href="/components/">Component Docs</a>
      </div>
    </article>
    <article class="landing-card">
      <p class="landing-eyebrow">MCP Included</p>
      <h3>Repository-local AI context</h3>
      <p>
        Contracts, docs, and validation tools are available through the built-in MCP server for deterministic agent workflows.
      </p>
      <a href="/MCP-SERVER">Read MCP server guide</a>
    </article>
    <article class="landing-card">
      <p class="landing-eyebrow">Why teams use Mezmer</p>
      <ul>
        <li>Domain-neutral component APIs</li>
        <li>Access behavior via injectable callbacks</li>
        <li>Contract and docs validation scripts</li>
      </ul>
    </article>
  </div>
  <div class="landing-steps">
    <h2>Built for clean delivery</h2>
    <ol>
      <li>Install the package and import styles and a theme.</li>
      <li>Compose domain-neutral components with explicit props.</li>
      <li>Validate behavior with contract and docs checks.</li>
    </ol>
  </div>
</section>

## Example

```tsx
import { Input } from '@tarikukebede/mezmer';
import '@tarikukebede/mezmer/styles.css';
import '@tarikukebede/mezmer/themes/default.css';

export function Example() {
  return <Input name="email" value="" onChange={() => {}} />;
}
```

Mezmer is built on React, TypeScript, shadcn/ui patterns, and tokenized styling conventions that scale across apps.

For architecture details and the complete stack rationale, see [Architecture](/ARCHITECTURE).

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

.landing-shell {
  margin: 1.6rem 0 2.2rem;
  display: grid;
  gap: 1rem;
}

.landing-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.95rem;
}

.landing-card {
  grid-column: span 4;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1rem;
  background:
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent 45%),
    var(--vp-c-bg-soft);
}

.landing-card--primary {
  grid-column: span 6;
}

.landing-eyebrow {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.landing-card h3 {
  margin: 0.35rem 0 0.45rem;
  font-size: 1.02rem;
}

.landing-card p {
  margin: 0.4rem 0 0;
  color: var(--vp-c-text-2);
}

.landing-card pre {
  margin: 0.55rem 0 0;
}

.landing-links {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.landing-card ul {
  margin: 0.6rem 0 0;
  padding-left: 1.1rem;
  color: var(--vp-c-text-2);
}

.landing-steps {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1rem 1.05rem;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--vp-c-brand-soft) 30%, transparent),
    var(--vp-c-bg-soft)
  );
}

.landing-steps h2 {
  margin: 0;
  font-size: 1.1rem;
}

.landing-steps ol {
  margin: 0.65rem 0 0;
  padding-left: 1.1rem;
  color: var(--vp-c-text-2);
}

:global(.VPFeature) {
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: linear-gradient(
    170deg,
    color-mix(in srgb, var(--vp-c-brand-soft) 22%, transparent),
    var(--vp-c-bg-soft)
  );
}

@media (max-width: 820px) {
  :global(.VPHero.has-image .image-container) {
    width: min(28rem, 100%);
  }

  .landing-card,
  .landing-card--primary {
    grid-column: 1 / -1;
  }
}
</style>
