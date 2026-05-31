import { type JSX } from 'react';
import Link from 'next/link';
import { FlowExampleTabs, type FlowExampleId } from './FlowExampleTabs';
import { withBasePath } from './withBasePath';

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
  dashboard: {
    title: 'Dashboard',
    summary:
      'An analytics workspace shell that composes a side navigation rail, KPI tiles, area and pie charts, and a recent-activity table into a single overview screen.',
    tags: ['Analytics', 'Overview', 'Workspace Shell'],
    highlights: [
      'Sidebar + main-content layout with KPI tiles, charts, and a data table',
      'Composes Page, Chart (Area + Pie), BaseTable, Chip, Text, and Button',
      'Ready to wire to live data, date-range filters, and per-section access rules',
    ],
    docsHref: '/flows/dashboard',
  },
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

const FLOW_ORDER: readonly FlowExampleId[] = ['dashboard', 'login'];

export function FlowDocsPage({ flow }: FlowDocsPageProps): JSX.Element {
  const doc = FLOW_DOCS[flow];
  const previewSrc = withBasePath(`/preview/flows/${flow}/`);

  return (
    <article className="rk-flow-page">
      <nav className="rk-flow-page__nav" aria-label="Flows">
        <Link href={withBasePath('/flows/')} className="rk-flow-page__nav-home">
          ← All flows
        </Link>
        <ul className="rk-flow-page__nav-list">
          {FLOW_ORDER.map((id) => {
            const isActive = id === flow;
            return (
              <li key={id}>
                <Link
                  href={withBasePath(`/flows/${id}/`)}
                  className={`rk-flow-page__nav-pill${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {FLOW_DOCS[id].title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <header className="rk-flow-page__topline">
        <p className="rk-flow-page__eyebrow">Flow</p>
        <h1 className="rk-flow-page__title">{doc.title}</h1>
        <p className="rk-flow-page__summary">{doc.summary}</p>
        <ul className="rk-flow-page__chips" aria-label="Tags">
          {doc.tags.map((tag) => (
            <li key={tag} className="rk-flow-page__chip">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div className="rk-flow-page__block component-example-tabs-host">
        <FlowExampleTabs flow={flow} previewSrc={previewSrc} />
      </div>

      <section className="rk-flow-page__about" aria-label="About this flow">
        <h2 className="rk-flow-page__about-title">About this flow</h2>
        <ul className="rk-flow-page__about-list">
          {doc.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
