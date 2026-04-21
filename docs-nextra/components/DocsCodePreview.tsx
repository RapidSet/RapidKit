import { useEffect, useState, type JSX } from 'react';

type DocsCodePreviewProps = Readonly<{
  code: string;
  language?: string;
}>;

type CopyState = 'idle' | 'done' | 'error';

function getCopyLabel(copyState: CopyState): string {
  if (copyState === 'done') {
    return 'Copied';
  }

  if (copyState === 'error') {
    return 'Failed';
  }

  return 'Copy';
}

export function DocsCodePreview({
  code,
  language = 'tsx',
}: DocsCodePreviewProps): JSX.Element {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [highlightedCodeHtml, setHighlightedCodeHtml] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function highlightCode(): Promise<void> {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, {
          lang: language,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        if (!isCancelled) {
          setHighlightedCodeHtml(html);
        }
      } catch {
        if (!isCancelled) {
          setHighlightedCodeHtml('');
        }
      }
    }

    void highlightCode();

    return () => {
      isCancelled = true;
    };
  }, [code, language]);

  async function copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('done');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => {
      setCopyState('idle');
    }, 1500);
  }

  return (
    <div className="component-example-tabs__code-viewer">
      <button
        type="button"
        className="component-example-tabs__copy-btn"
        onClick={copyCode}
        aria-label="Copy code snippet"
      >
        {getCopyLabel(copyState)}
      </button>

      <div className="component-example-tabs__code-scroll component-example-tabs__code-block">
        {highlightedCodeHtml ? (
          <div
            className="component-example-tabs__shiki"
            dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
          />
        ) : (
          <pre>
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
