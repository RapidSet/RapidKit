import { type JSX } from 'react';
import { ExampleTabs } from './ExampleTabs';
import { MultiFileCodePreview } from './MultiFileCodePreview';
import { FlowPreviewFrame } from './FlowPreviewFrame';
import { FLOW_EXAMPLE_FILES } from '../registry/generated/flowFiles';
import DashboardFlowPreview from '../registry/flows/dashboard';
import LoginFlowPreview from '../registry/flows/login';

export type FlowExampleId = 'dashboard' | 'login';

type FlowTab = 'preview' | 'code';

type FlowExampleTabsProps = Readonly<{
  flow: FlowExampleId;
  initialTab?: FlowTab;
  previewSrc: string;
}>;

type FlowExample = Readonly<{
  defaultPath: string;
  render: () => JSX.Element;
}>;

const FLOW_EXAMPLES: Record<FlowExampleId, FlowExample> = {
  dashboard: {
    defaultPath: 'DashboardPage.tsx',
    render: DashboardFlowPreview,
  },
  login: {
    defaultPath: 'LoginPage.tsx',
    render: LoginFlowPreview,
  },
};

export const FLOW_EXAMPLE_IDS = Object.keys(FLOW_EXAMPLES) as FlowExampleId[];

export function FlowPreviewSurface({
  flow,
}: Readonly<{ flow: FlowExampleId }>): JSX.Element {
  const Preview = FLOW_EXAMPLES[flow].render;
  return <Preview />;
}

export function FlowExampleTabs({
  flow,
  initialTab,
  previewSrc,
}: FlowExampleTabsProps): JSX.Element {
  const example = FLOW_EXAMPLES[flow];
  const files = FLOW_EXAMPLE_FILES[flow];

  return (
    <ExampleTabs
      ariaLabel="Flow example tabs"
      initialTab={initialTab}
      previewPanelClassName="component-example-tabs__panel--flow"
      previewSlot={<FlowPreviewFrame flow={flow} previewSrc={previewSrc} />}
      codeSlot={
        <MultiFileCodePreview
          files={files}
          defaultPath={example.defaultPath}
          rootLabel={`flows/${flow}`}
        />
      }
    />
  );
}
