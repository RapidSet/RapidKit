---
layout: home

hero:
  text: AI-First React UI For Product Teams
  tagline: Designed for AI-assisted delivery by combining proven technologies into enterprise-grade generation workflows, reusable patterns, and production code standards.
  actions:
    - theme: brand
      text: Get Started
      link: /INSTALLATION
    - theme: alt
      text: Browse Components
      link: /components/
---

<section class="home-tech" aria-label="Component technologies">
  <span class="home-tech__item"><span class="home-tech__dot" aria-hidden="true"></span>Radix UI</span>
  <span class="home-tech__item"><span class="home-tech__dot" aria-hidden="true"></span>shadcn/ui</span>
  <span class="home-tech__item"><span class="home-tech__dot" aria-hidden="true"></span>Zod</span>
  <span class="home-tech__item"><span class="home-tech__dot" aria-hidden="true"></span>RTK Query</span>
  <span class="home-tech__item"><span class="home-tech__dot" aria-hidden="true"></span>TanStack</span>
  <span class="home-tech__item"><span class="home-tech__dot" aria-hidden="true"></span>Tailwind CSS</span>
</section>

<section class="home-center">
  <p class="home-center__kicker">AI-first by design</p>
  <p class="home-center__message">
    Build faster with proven technologies, predictable APIs, and enterprise-ready implementation patterns.
  </p>
  <p class="home-center__sub">
    RapidKit is engineered for production-grade, agent-assisted code generation from day one, blending established React, TypeScript, and shadcn foundations with contract-aligned docs, tests, and quality gates.
  </p>
  <div class="home-center__links">
    <a href="/ARCHITECTURE">Architecture</a>
    <a href="/THEMING">Theming</a>
    <a href="/MCP-SERVER">MCP Server</a>
  </div>
</section>

<section class="home-install">
  <span>Install</span>
  <code>pnpm add @rapidset/rapidkit</code>
</section>

<style scoped>
:global(.VPHome) {
  background:
    radial-gradient(700px 320px at 50% -2%, color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent), transparent 72%),
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-bg-soft) 60%, transparent), transparent 40%);
}

:global(.VPHero) {
  margin-top: 1.25rem;
}

:global(.VPHero .container) {
  max-width: 940px;
}

:global(.VPHero .main) {
  margin: 0 auto;
  text-align: center;
}

:global(.VPHero .name) {
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

:global(.VPHero .text) {
  margin: 0.5rem auto 0;
  max-width: 14ch;
  font-size: clamp(2rem, 6.2vw, 3.7rem);
  line-height: 1.03;
  letter-spacing: -0.04em;
}

:global(.VPHero .tagline) {
  margin: 0.8rem auto 0;
  max-width: 48ch;
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

:global(.VPHero .actions) {
  justify-content: center;
  gap: 0.55rem;
}

:global(.VPHero .action .VPButton) {
  border-radius: 999px;
  min-height: 2.5rem;
}

.home-tech {
  margin: 0.3rem auto 0;
  max-width: 940px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.home-tech__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.26rem 0.56rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 80%, transparent);
  font-size: 0.76rem;
  letter-spacing: 0.01em;
  color: var(--vp-c-text-2);
}

.home-tech__dot {
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
}

.home-center {
  margin: 0.9rem auto 0;
  max-width: 760px;
  text-align: center;
  padding: 1.4rem 1.1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, transparent);
}

.home-center__kicker {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.home-center__message {
  margin: 0.65rem auto 0;
  max-width: 30ch;
  font-size: clamp(1.14rem, 2.2vw, 1.45rem);
  line-height: 1.28;
  letter-spacing: -0.02em;
}

.home-center__sub {
  margin: 0.65rem auto 0;
  max-width: 62ch;
  color: var(--vp-c-text-2);
}

.home-center__links {
  margin-top: 0.95rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.home-center__links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.42rem 0.72rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.home-install {
  margin: 0.95rem auto 0;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.94rem;
}

.home-install code {
  padding: 0.34rem 0.56rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg);
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  :global(.VPHero .text) {
    max-width: 12ch;
  }

  .home-center {
    padding: 1.15rem 0.9rem;
  }

  .home-tech {
    gap: 0.55rem;
  }
}
</style>
