import { useMemo, useState, type JSX } from 'react';
import { FileTree, type FileTreeNode } from './FileTree';

export type MultiFileCodePreviewFile = Readonly<{
  path: string;
  content: string;
  language?: 'tsx' | 'ts' | 'css' | 'json' | 'jsx' | 'js' | 'md';
  /**
   * Pre-rendered Shiki HTML (dual github-light / github-dark themes).
   * Produced at build time by `scripts/generate-example-code-manifest.mjs`
   * so the Code tab paints already-highlighted source in the first frame.
   * Optional so callers (e.g. tests) can pass minimal fixtures and fall
   * back to a plain <pre><code> render.
   */
  html?: string;
}>;

type MultiFileCodePreviewProps = Readonly<{
  files: readonly MultiFileCodePreviewFile[];
  defaultPath?: string;
  rootLabel?: string;
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

export function MultiFileCodePreview({
  files,
  defaultPath,
  rootLabel,
}: MultiFileCodePreviewProps): JSX.Element {
  const fileTreeNodes = useMemo<readonly FileTreeNode[]>(
    () => files.map((file) => ({ path: file.path })),
    [files],
  );

  const initialPath = useMemo<string>(() => {
    if (files.length === 0) {
      return '';
    }

    if (defaultPath) {
      const match = files.find((file) => file.path === defaultPath);
      if (match) {
        return match.path;
      }
    }

    return files[0]?.path ?? '';
  }, [files, defaultPath]);

  const [activePath, setActivePath] = useState<string>(initialPath);

  // If the files array changes such that activePath no longer exists,
  // fall back to the first available file. (Defensive — typical docs
  // usage passes a stable list.)
  const clampedActivePath = useMemo<string>(() => {
    if (files.some((file) => file.path === activePath)) {
      return activePath;
    }
    return initialPath;
  }, [files, activePath, initialPath]);

  const activeFile = useMemo<MultiFileCodePreviewFile | undefined>(
    () => files.find((file) => file.path === clampedActivePath),
    [files, clampedActivePath],
  );

  const activeContent = activeFile?.content ?? '';
  const highlightedCodeHtml = activeFile?.html ?? '';

  const [copyState, setCopyState] = useState<CopyState>('idle');

  async function copyActiveFile(): Promise<void> {
    if (!activeFile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopyState('done');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => {
      setCopyState('idle');
    }, 1500);
  }

  const displayedPath = activeFile
    ? `${rootLabel ? `${rootLabel}/` : ''}${activeFile.path}`
    : '';

  return (
    <div className="multi-file-code">
      <FileTree
        files={fileTreeNodes}
        activePath={clampedActivePath}
        onSelect={setActivePath}
        rootLabel={rootLabel}
      />

      <div className="multi-file-code__pane">
        <div className="multi-file-code__path">
          <span className="multi-file-code__path-text" title={displayedPath}>
            {displayedPath}
          </span>

          <button
            type="button"
            className="multi-file-code__copy"
            onClick={copyActiveFile}
            aria-label="Copy file contents"
            disabled={!activeFile}
          >
            {getCopyLabel(copyState)}
          </button>
        </div>

        <div className="multi-file-code__scroll component-example-tabs__code-block">
          {highlightedCodeHtml ? (
            <div
              className="component-example-tabs__shiki"
              dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
            />
          ) : (
            <pre>
              <code>{activeContent}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
