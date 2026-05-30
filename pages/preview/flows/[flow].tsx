import { type JSX } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  FLOW_EXAMPLE_IDS,
  FlowPreviewSurface,
  type FlowExampleId,
} from '../../../docs-nextra/components/FlowExampleTabs';
import { useDocsPreviewThemeBridge } from '../../../docs-nextra/components/usePreviewThemeBridge';

type FlowPreviewRouteProps = Readonly<{
  flow: FlowExampleId;
}>;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: FLOW_EXAMPLE_IDS.map((flow) => ({ params: { flow } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<FlowPreviewRouteProps> = ({
  params,
}) => {
  const flow = params?.flow as FlowExampleId;
  return { props: { flow } };
};

export default function FlowPreviewRoute({
  flow,
}: FlowPreviewRouteProps): JSX.Element {
  useDocsPreviewThemeBridge(flow);

  return (
    <div className="rk-flow-preview-route min-h-screen w-full bg-background">
      <FlowPreviewSurface flow={flow} />
    </div>
  );
}
