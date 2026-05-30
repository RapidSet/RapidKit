import { type JSX } from 'react';
import { PreviewFrame } from './PreviewFrame';
import type { FlowExampleId } from './FlowExampleTabs';

type FlowPreviewFrameProps = Readonly<{
  flow: FlowExampleId;
  previewSrc: string;
}>;

export function FlowPreviewFrame({
  flow,
  previewSrc,
}: FlowPreviewFrameProps): JSX.Element {
  return (
    <PreviewFrame id={flow} previewSrc={previewSrc} titlePrefix="Preview" />
  );
}
