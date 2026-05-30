import { useId, useState, type JSX, type ReactNode } from 'react';

type Tab = 'preview' | 'code';

type ExampleTabsProps = Readonly<{
  previewSlot: ReactNode;
  codeSlot: ReactNode;
  initialTab?: Tab;
  ariaLabel?: string;
  previewPanelClassName?: string;
}>;

function resolveInitialTab(initialTab?: Tab): Tab {
  if (initialTab) {
    return initialTab;
  }

  if (globalThis.window === undefined) {
    return 'preview';
  }

  const tab = new URLSearchParams(globalThis.window.location.search).get('tab');
  return tab === 'code' ? 'code' : 'preview';
}

export function ExampleTabs({
  previewSlot,
  codeSlot,
  initialTab,
  ariaLabel = 'Example tabs',
  previewPanelClassName,
}: ExampleTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    resolveInitialTab(initialTab),
  );
  const idPrefix = useId();
  const previewTabId = `${idPrefix}-preview-tab`;
  const codeTabId = `${idPrefix}-code-tab`;
  const previewPanelId = `${idPrefix}-preview-panel`;
  const codePanelId = `${idPrefix}-code-panel`;

  const previewPanelClass = previewPanelClassName
    ? `component-example-tabs__panel ${previewPanelClassName}`
    : 'component-example-tabs__panel';

  return (
    <div className="component-example-tabs">
      <div className="component-example-tabs__controls">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex items-center gap-1"
        >
          <button
            id={previewTabId}
            type="button"
            role="tab"
            aria-controls={previewPanelId}
            aria-selected={activeTab === 'preview'}
            className={`component-example-tabs__button ${
              activeTab === 'preview' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            id={codeTabId}
            type="button"
            role="tab"
            aria-controls={codePanelId}
            aria-selected={activeTab === 'code'}
            className={`component-example-tabs__button ${
              activeTab === 'code' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        </div>
      </div>

      <div
        id={previewPanelId}
        role="tabpanel"
        aria-labelledby={previewTabId}
        hidden={activeTab !== 'preview'}
        className={previewPanelClass}
      >
        {previewSlot}
      </div>

      <div
        id={codePanelId}
        role="tabpanel"
        aria-labelledby={codeTabId}
        hidden={activeTab !== 'code'}
        className="component-example-tabs__panel"
      >
        {activeTab === 'code' ? codeSlot : null}
      </div>
    </div>
  );
}
