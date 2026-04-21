import { useMemo } from 'react';
import { ArrowRight, BookOpen, Cpu, LayoutGrid, Palette } from 'lucide-react';
import { Button, ButtonVariant } from '../src/components/Button';
import { Icon } from '../src/components/Icon';
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
    <div className="mz-home">
      <SiteHeader items={SITE_NAV_ITEMS} />
      <section className="mz-hero">
        <article className="mz-hero-copy">
          <a className="mz-announcement" href={toHref('/ARCHITECTURE/')}>
            <Icon
              icon={Cpu}
              className="mz-announcement-icon"
              aria-hidden="true"
            />
            Standalone, reusable, publishable
          </a>
          <h1>AI-first React UI kit for production-grade delivery.</h1>
          <p className="mz-subtitle">
            RapidKit is a domain-neutral component library for external
            consumers, engineered for AI-assisted implementation with strict
            TypeScript APIs, contract-aligned docs, and tree-shakeable package
            exports.
          </p>
          <div className="mz-hero-actions">
            <Button
              variant={ButtonVariant.Primary}
              className="mz-btn mz-btn-primary"
              rightIcon={ArrowRight}
              onClick={() => navigateTo('/components/')}
            >
              Start Building
            </Button>
            <Button
              variant={ButtonVariant.Outlined}
              className="mz-btn mz-btn-ghost"
              leftIcon={BookOpen}
              onClick={() => navigateTo('/components/')}
            >
              View Components
            </Button>
          </div>
          <ul className="mz-hero-meta" aria-label="Highlights">
            <li>
              <Icon
                icon={Cpu}
                className="mz-hero-meta-icon"
                aria-hidden="true"
              />
              AI-first contract workflow
            </li>
            <li>
              <Icon
                icon={Palette}
                className="mz-hero-meta-icon"
                aria-hidden="true"
              />
              Domain-neutral APIs
            </li>
            <li>
              <Icon
                icon={LayoutGrid}
                className="mz-hero-meta-icon"
                aria-hidden="true"
              />
              Composable, accessible primitives
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
