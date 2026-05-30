import { useEffect, type JSX } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  FLOW_EXAMPLE_IDS,
  FlowPreviewSurface,
  type FlowExampleId,
} from '../../../docs-nextra/components/FlowExampleTabs';
import { applyRuntimeThemeStylesheet } from '../../../docs-nextra/components/siteTheme';

type FlowPreviewRouteProps = Readonly<{
  flow: FlowExampleId;
}>;

const SET_THEME_MESSAGE = 'rapidkit:set-theme';
const READY_MESSAGE = 'rapidkit:preview-ready';

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
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.source !== window.parent) {
        return;
      }

      const data = event.data as
        | { type?: unknown; themeId?: unknown; mode?: unknown }
        | undefined;

      if (!data || data.type !== SET_THEME_MESSAGE) {
        return;
      }

      if (typeof data.themeId === 'string') {
        applyRuntimeThemeStylesheet(data.themeId);
      }

      if (data.mode === 'dark' || data.mode === 'light') {
        const root = document.documentElement;
        root.classList.toggle('dark', data.mode === 'dark');
        root.dataset.theme = data.mode;
        root.dataset.colorMode = data.mode;
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          { type: READY_MESSAGE, flow },
          window.location.origin,
        );
      } catch {
        // parent may be cross-origin; ignore
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [flow]);

  return (
    <div className="rk-flow-preview-route min-h-screen w-full bg-background">
      <FlowPreviewSurface flow={flow} />
    </div>
  );
}
