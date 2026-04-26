import { useEffect, useState, type JSX } from 'react';
import {
  FlowExampleTabs,
  FlowPreviewSurface,
  type FlowExampleId,
} from './FlowExampleTabs';

type FlowDoc = Readonly<{
  title: string;
  summary: string;
  tags: readonly string[];
  highlights: readonly string[];
  docsHref: string;
}>;

type FlowDocsPageProps = Readonly<{
  flow: FlowExampleId;
}>;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

function withBasePath(path: string): string {
  if (!path) {
    return basePath || '/';
  }

  if (!basePath) {
    return path;
  }

  if (path.startsWith(basePath)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

const FLOW_DOCS: Record<FlowExampleId, FlowDoc> = {
  login: {
    title: 'Login',
    summary:
      'A focused login page that shows the end-to-end integration points for provider sign-in, password entry, recovery, and post-auth extensions.',
    tags: ['Authentication', 'Sign In', 'Account Access'],
    highlights: [
      'Single-page layout centered on the login form itself',
      'Includes primary sign-in, password reset affordance, and SSO-style actions',
      'Ready to extend with MFA prompts, invite acceptance, or validation wiring',
    ],
    docsHref: '/flows/login',
  },
};

export function FlowDocsIndexPage(): JSX.Element {
  return (
    <article className="component-doc-page">
      <header className="component-doc-hero">
        <p className="component-doc-hero__eyebrow">Composable page flows</p>
        <h1>Flows</h1>
        <p className="component-doc-hero__summary">
          Browse reference flows that show how RapidKit components, hooks, and
          local adapters fit together in full-page application screens.
        </p>
      </header>

      <section className="component-doc-section">
        <div className="component-doc-section__header">
          <h2>Overview</h2>
          <p>
            Flows are implementation references for page-level composition. They
            stay outside the core package API while documenting how multiple
            primitives work together in realistic screens.
          </p>
        </div>

        <div className="component-doc-note-grid">
          <section className="component-doc-note-card">
            <h2>What flows are for</h2>
            <p>
              These pages show where validation, async state, navigation
              affordances, and supporting layout decisions should live when you
              build on top of the kit.
            </p>
          </section>

          <section className="component-doc-note-card">
            <h2>How to use the docs</h2>
            <p>
              Open a flow page to inspect the preview and switch to the code tab
              for a copyable example. Use the full-page preview when you need to
              assess the complete layout in context.
            </p>
          </section>
        </div>
      </section>

      <div className="component-doc-note-grid">
        <section className="component-doc-note-card">
          <h2>Composition boundaries</h2>
          <p>
            Flow examples document layout and interaction composition without
            turning page-level behavior into package-owned primitives. Business
            rules, routing, and host-specific data adapters should stay local to
            the consuming app.
          </p>
        </section>

        <section className="component-doc-note-card">
          <h2>What to expect on flow pages</h2>
          <p>
            Each flow page focuses on the assembled screen, the main interaction
            path, and the implementation shape behind it so teams can adapt the
            pattern without inheriting product-specific assumptions.
          </p>
        </section>
      </div>
    </article>
  );
}

export function FlowDocsPage({ flow }: FlowDocsPageProps): JSX.Element {
  const doc = FLOW_DOCS[flow];
  const docsHref = withBasePath(doc.docsHref);
  const [isFullMode, setIsFullMode] = useState(false);

  useEffect(() => {
    if (globalThis.window === undefined) {
      return;
    }

    const nextIsFullMode =
      new URLSearchParams(globalThis.window.location.search).get('view') ===
      'full';

    setIsFullMode(nextIsFullMode);
  }, []);

  useEffect(() => {
    if (!isFullMode || globalThis.document === undefined) {
      return;
    }

    const previousOverflow = globalThis.document.body.style.overflow;
    globalThis.document.body.style.overflow = 'hidden';

    return () => {
      globalThis.document.body.style.overflow = previousOverflow;
    };
  }, [isFullMode]);

  if (isFullMode) {
    return (
      <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-auto bg-background">
        <div className="h-full w-full p-0">
          <FlowPreviewSurface flow={flow} />
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-6xl flex-col gap-5">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Flow
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {doc.title}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{doc.summary}</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {doc.highlights.map((item) => (
          <div
            key={item}
            className="rounded-sm border border-border bg-card p-3 text-xs text-muted-foreground"
          >
            {item}
          </div>
        ))}
      </section>

      <section className="component-example-tabs-host flex-1 min-h-[calc(100vh-23rem)]">
        <FlowExampleTabs
          flow={flow}
          fullPreviewHref={`${docsHref}?view=full`}
        />
      </section>
    </article>
  );
}
