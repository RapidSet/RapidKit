import { useMemo, useState, type JSX } from 'react';
import { FileTree, type FileTreeNode } from './FileTree';
import { useShikiHtml } from './useShikiHtml';

export type MultiFileCodePreviewFile = Readonly<{
  path: string;
  content: string;
  language?: 'tsx' | 'ts' | 'css' | 'json' | 'jsx' | 'js' | 'md';
}>;

type MultiFileCodePreviewProps = Readonly<{
  files: readonly MultiFileCodePreviewFile[];
  defaultPath?: string;
  rootLabel?: string;
}>;

type CopyState = 'idle' | 'done' | 'error';

const EXTENSION_LANGUAGE_MAP: Readonly<
  Record<string, MultiFileCodePreviewFile['language']>
> = {
  tsx: 'tsx',
  ts: 'ts',
  jsx: 'jsx',
  js: 'js',
  css: 'css',
  json: 'json',
  md: 'md',
};

function getCopyLabel(copyState: CopyState): string {
  if (copyState === 'done') {
    return 'Copied';
  }

  if (copyState === 'error') {
    return 'Failed';
  }

  return 'Copy';
}

function inferLanguage(
  file: MultiFileCodePreviewFile,
): NonNullable<MultiFileCodePreviewFile['language']> {
  if (file.language) {
    return file.language;
  }

  const dotIndex = file.path.lastIndexOf('.');

  if (dotIndex !== -1 && dotIndex < file.path.length - 1) {
    const ext = file.path.slice(dotIndex + 1).toLowerCase();
    const language = EXTENSION_LANGUAGE_MAP[ext];

    if (language) {
      return language;
    }
  }

  return 'tsx';
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

  const activeLanguage = activeFile ? inferLanguage(activeFile) : 'tsx';
  const activeContent = activeFile?.content ?? '';
  const highlightedCodeHtml = useShikiHtml(activeContent, activeLanguage);

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
