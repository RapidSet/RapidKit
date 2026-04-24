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

const FLOW_ORDER: readonly FlowExampleId[] = ['login'];

function FlowBlockCard({
  flow,
}: Readonly<{ flow: FlowExampleId }>): JSX.Element {
  const doc = FLOW_DOCS[flow];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card">
      <div className="relative border-b border-border bg-gradient-to-br from-background via-muted/40 to-muted/70 p-5">
        <div className="flex flex-wrap gap-2">
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {doc.highlights.map((item) => (
            <div
              key={item}
              className="rounded-sm border border-border bg-background/80 p-3 text-xs text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{doc.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{doc.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={doc.docsHref}
            className="inline-flex items-center rounded-sm border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground no-underline transition-colors hover:bg-secondary/80"
          >
            Preview
          </a>
          <a
            href={`${doc.docsHref}?tab=code`}
            className="inline-flex items-center rounded-sm border border-border bg-background px-4 py-2 text-sm font-medium text-foreground no-underline transition-colors hover:bg-muted"
          >
            Code
          </a>
        </div>
      </div>
    </article>
  );
}

export function FlowDocsIndexPage(): JSX.Element {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-6xl flex-col space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Flows
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Ready-to-use page flows
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Flows are presented as blocks: open a full-page preview in a new tab,
          then switch between Preview and Code from the controls at the
          top-left.
        </p>
      </section>

      <section className="grid flex-1 auto-rows-fr gap-6 lg:grid-cols-2">
        {FLOW_ORDER.map((flow) => (
          <FlowBlockCard key={flow} flow={flow} />
        ))}
      </section>
    </div>
  );
}

export function FlowDocsPage({ flow }: FlowDocsPageProps): JSX.Element {
  const doc = FLOW_DOCS[flow];
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
          fullPreviewHref={`${doc.docsHref}?view=full`}
        />
      </section>
    </article>
  );
}
