import { useEffect, useState } from 'react';

/**
 * Returns Shiki-highlighted HTML for the given code/language using the
 * site's dual github-light / github-dark theme pair. Empty string while
 * loading or on error — callers should fall back to plain <pre><code>.
 *
 * Used by both DocsCodePreview and MultiFileCodePreview to keep a single
 * source of truth for the docs-site syntax highlighting pipeline.
 */
export function useShikiHtml(code: string, language: string): string {
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

  return highlightedCodeHtml;
}
