import { useMemo } from 'react';
import { ArrowRight, BookOpen, Cpu, LayoutGrid, Palette } from 'lucide-react';
import { Button, ButtonVariant } from '../src/components/Button';
import { Chip } from '../src/components/Chip';
import { SiteHeader } from '../docs-nextra/components/SiteHeader';
import { SITE_NAV_ITEMS } from '../docs-nextra/components/siteNavigation';

export default function HomeLandingPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const toHref = useMemo(() => {
    return (path) => `${basePath}${path}`;
  }, [basePath]);

  const navigateTo = (path) => {
    globalThis.location.assign(toHref(path));
  };

  return (
    <div className="rk-home">
      <SiteHeader items={SITE_NAV_ITEMS} />
      <section className="rk-hero">
        <article className="rk-hero-copy">
          <a className="rk-announcement" href={toHref('/ARCHITECTURE/')}>
            <Chip
              label="Standalone, reusable, publishable"
              icon={Cpu}
              variant="outline"
              size="sm"
              className="normal-case uppercase tracking-[0.06em] text-[0.58rem] text-muted-foreground transition-colors hover:text-foreground"
            />
          </a>
          <h1>AI-first React UI kit for production-grade delivery.</h1>
          <p className="rk-subtitle">
            RapidKit is a domain-neutral component library for external
            consumers, engineered for AI-assisted implementation with strict
            TypeScript APIs, contract-aligned docs, and tree-shakeable package
            exports.
          </p>
          <div className="rk-hero-actions">
            <Button
              variant={ButtonVariant.Primary}
              rightIcon={ArrowRight}
              onClick={() => navigateTo('/components/')}
            >
              Start Building
            </Button>
            <Button
              variant={ButtonVariant.Outlined}
              leftIcon={BookOpen}
              onClick={() => navigateTo('/components/')}
            >
              View Components
            </Button>
          </div>
          <ul className="rk-hero-meta" aria-label="Highlights">
            <li>
              <Chip
                label="AI-first contract workflow"
                icon={Cpu}
                variant="outline"
                className="normal-case"
              />
            </li>
            <li>
              <Chip
                label="Domain-neutral APIs"
                icon={Palette}
                variant="outline"
                className="normal-case"
              />
            </li>
            <li>
              <Chip
                label="Composable, accessible primitives"
                icon={LayoutGrid}
                variant="outline"
                className="normal-case"
              />
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
