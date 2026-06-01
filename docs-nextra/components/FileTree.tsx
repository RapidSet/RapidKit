import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';

export type FileTreeNode = Readonly<{
  path: string;
}>;

export type FileTreeProps = Readonly<{
  files: readonly FileTreeNode[];
  activePath: string;
  onSelect: (path: string) => void;
  rootLabel?: string;
}>;

// Internal tree model -------------------------------------------------------

type InternalFolderNode = {
  readonly kind: 'folder';
  readonly name: string;
  readonly path: string; // joined folder path, e.g. 'components/ui'
  readonly children: InternalNode[];
};

type InternalFileNode = {
  readonly kind: 'file';
  readonly name: string;
  readonly path: string; // full file path matching FileTreeNode.path
};

type InternalNode = InternalFolderNode | InternalFileNode;

type FlatVisibleNode = Readonly<{
  id: string; // stable id (the node's path)
  kind: 'folder' | 'file';
  depth: number;
}>;

const FILE_CODE_EXTENSIONS = new Set(['tsx', 'ts', 'jsx', 'js']);

function getFileExtension(name: string): string {
  const dotIndex = name.lastIndexOf('.');

  if (dotIndex === -1 || dotIndex === name.length - 1) {
    return '';
  }

  return name.slice(dotIndex + 1).toLowerCase();
}

function isCodeFile(name: string): boolean {
  return FILE_CODE_EXTENSIONS.has(getFileExtension(name));
}

function buildTree(files: readonly FileTreeNode[]): InternalNode[] {
  const root: InternalFolderNode = {
    kind: 'folder',
    name: '',
    path: '',
    children: [],
  };

  for (const file of files) {
    const segments = file.path
      .split('/')
      .filter((segment) => segment.length > 0);

    if (segments.length === 0) {
      continue;
    }

    let cursor: InternalFolderNode = root;

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index] ?? '';
      const isLast = index === segments.length - 1;

      if (isLast) {
        const fileNode: InternalFileNode = {
          kind: 'file',
          name: segment,
          path: file.path,
        };
        cursor.children.push(fileNode);
        continue;
      }

      const folderPath =
        cursor.path === '' ? segment : `${cursor.path}/${segment}`;

      let nextFolder = cursor.children.find(
        (child): child is InternalFolderNode =>
          child.kind === 'folder' && child.name === segment,
      );

      if (!nextFolder) {
        nextFolder = {
          kind: 'folder',
          name: segment,
          path: folderPath,
          children: [],
        };
        cursor.children.push(nextFolder);
      }

      cursor = nextFolder;
    }
  }

  sortTree(root);
  return root.children;
}

function sortTree(folder: InternalFolderNode): void {
  folder.children.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  for (const child of folder.children) {
    if (child.kind === 'folder') {
      sortTree(child);
    }
  }
}

function collectAllFolderPaths(nodes: readonly InternalNode[]): string[] {
  const folderPaths: string[] = [];

  function walk(currentNodes: readonly InternalNode[]): void {
    for (const node of currentNodes) {
      if (node.kind === 'folder') {
        folderPaths.push(node.path);
        walk(node.children);
      }
    }
  }

  walk(nodes);
  return folderPaths;
}

function flattenVisible(
  nodes: readonly InternalNode[],
  expanded: ReadonlySet<string>,
  depth: number,
  out: FlatVisibleNode[],
): void {
  for (const node of nodes) {
    if (node.kind === 'folder') {
      out.push({ id: node.path, kind: 'folder', depth });

      if (expanded.has(node.path)) {
        flattenVisible(node.children, expanded, depth + 1, out);
      }
    } else {
      out.push({ id: node.path, kind: 'file', depth });
    }
  }
}

function findFolderAncestorPaths(targetPath: string): string[] {
  const segments = targetPath
    .split('/')
    .filter((segment) => segment.length > 0);

  if (segments.length <= 1) {
    return [];
  }

  const ancestors: string[] = [];
  let acc = '';

  for (let index = 0; index < segments.length - 1; index += 1) {
    acc =
      acc === '' ? (segments[index] ?? '') : `${acc}/${segments[index] ?? ''}`;
    ancestors.push(acc);
  }

  return ancestors;
}

// Rendering -----------------------------------------------------------------

type NodeRowProps = Readonly<{
  node: InternalNode;
  depth: number;
  expanded: ReadonlySet<string>;
  activePath: string;
  focusedId: string;
  onToggle: (folderPath: string) => void;
  onSelect: (path: string) => void;
  onFocusNode: (id: string) => void;
  registerRow: (id: string, el: HTMLElement | null) => void;
}>;

function NodeRow({
  node,
  depth,
  expanded,
  activePath,
  focusedId,
  onToggle,
  onSelect,
  onFocusNode,
  registerRow,
}: NodeRowProps): JSX.Element {
  if (node.kind === 'folder') {
    const isExpanded = expanded.has(node.path);
    const isFocused = focusedId === node.path;
    const Icon = isExpanded ? FolderOpen : Folder;
    const Chevron = isExpanded ? ChevronDown : ChevronRight;

    return (
      <li role="none">
        <div
          role="treeitem"
          aria-expanded={isExpanded}
          aria-level={depth + 1}
          tabIndex={isFocused ? 0 : -1}
          ref={(el) => {
            registerRow(node.path, el);
          }}
          className="multi-file-code__tree-node multi-file-code__tree-node--folder"
          style={{ paddingInlineStart: `${0.5 + depth * 0.75}rem` }}
          onClick={() => {
            onFocusNode(node.path);
            onToggle(node.path);
          }}
          onFocus={() => {
            onFocusNode(node.path);
          }}
        >
          <Chevron
            size={12}
            className="multi-file-code__tree-chevron"
            aria-hidden="true"
          />
          <Icon
            size={14}
            className="multi-file-code__tree-icon"
            aria-hidden="true"
          />
          <span className="multi-file-code__tree-label">{node.name}</span>
        </div>

        {isExpanded ? (
          <ul role="group" className="multi-file-code__tree-children">
            {node.children.map((child) => (
              <NodeRow
                key={child.path}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                activePath={activePath}
                focusedId={focusedId}
                onToggle={onToggle}
                onSelect={onSelect}
                onFocusNode={onFocusNode}
                registerRow={registerRow}
              />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  const isActive = activePath === node.path;
  const isFocused = focusedId === node.path;
  const Icon = isCodeFile(node.name) ? FileCode : FileText;
  const extension = getFileExtension(node.name) || 'unknown';
  const iconClass = `multi-file-code__tree-icon multi-file-code__tree-icon--${extension}`;

  return (
    <li role="none">
      <div
        role="treeitem"
        aria-selected={isActive}
        aria-level={depth + 1}
        tabIndex={isFocused ? 0 : -1}
        ref={(el) => {
          registerRow(node.path, el);
        }}
        className={
          'multi-file-code__tree-node multi-file-code__tree-node--file' +
          (isActive ? ' multi-file-code__tree-node--active' : '')
        }
        style={{ paddingInlineStart: `${0.5 + depth * 0.75}rem` }}
        onClick={() => {
          onFocusNode(node.path);
          onSelect(node.path);
        }}
        onFocus={() => {
          onFocusNode(node.path);
        }}
      >
        <span
          className="multi-file-code__tree-chevron multi-file-code__tree-chevron--spacer"
          aria-hidden="true"
        />
        <Icon size={14} className={iconClass} aria-hidden="true" />
        <span className="multi-file-code__tree-label">{node.name}</span>
      </div>
    </li>
  );
}

export function FileTree({
  files,
  activePath,
  onSelect,
  rootLabel,
}: FileTreeProps): JSX.Element {
  const tree = useMemo(() => buildTree(files), [files]);

  const initialExpanded = useMemo(
    () => new Set<string>(collectAllFolderPaths(tree)),
    [tree],
  );

  const [expanded, setExpanded] =
    useState<ReadonlySet<string>>(initialExpanded);

  // Reset expanded state when the underlying file set changes.
  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);

  const [focusedId, setFocusedId] = useState<string>(() => {
    if (activePath.length > 0) {
      return activePath;
    }

    const flat: FlatVisibleNode[] = [];
    flattenVisible(tree, initialExpanded, 0, flat);
    return flat[0]?.id ?? '';
  });

  // Keep focused row in sync if the active file changes externally.
  useEffect(() => {
    if (activePath.length > 0) {
      setFocusedId((current) => (current === '' ? activePath : current));
    }
  }, [activePath]);

  const visibleNodes = useMemo(() => {
    const out: FlatVisibleNode[] = [];
    flattenVisible(tree, expanded, 0, out);
    return out;
  }, [tree, expanded]);

  const rowRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerRow = useCallback((id: string, el: HTMLElement | null) => {
    if (el === null) {
      rowRefs.current.delete(id);
    } else {
      rowRefs.current.set(id, el);
    }
  }, []);

  const handleToggle = useCallback((folderPath: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  }, []);

  const focusNodeById = useCallback((id: string) => {
    setFocusedId(id);
    const el = rowRefs.current.get(id);
    if (el) {
      el.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLUListElement>) => {
      if (visibleNodes.length === 0) {
        return;
      }

      const currentIndex = visibleNodes.findIndex(
        (entry) => entry.id === focusedId,
      );
      const safeIndex = currentIndex === -1 ? 0 : currentIndex;
      const currentEntry = visibleNodes[safeIndex];

      if (!currentEntry) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextEntry =
            visibleNodes[Math.min(safeIndex + 1, visibleNodes.length - 1)];
          if (nextEntry) {
            focusNodeById(nextEntry.id);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevEntry = visibleNodes[Math.max(safeIndex - 1, 0)];
          if (prevEntry) {
            focusNodeById(prevEntry.id);
          }
          break;
        }
        case 'ArrowRight': {
          if (currentEntry.kind === 'folder') {
            event.preventDefault();
            if (!expanded.has(currentEntry.id)) {
              handleToggle(currentEntry.id);
            } else {
              const nextEntry = visibleNodes[safeIndex + 1];
              if (nextEntry && nextEntry.depth > currentEntry.depth) {
                focusNodeById(nextEntry.id);
              }
            }
          }
          break;
        }
        case 'ArrowLeft': {
          if (currentEntry.kind === 'folder' && expanded.has(currentEntry.id)) {
            event.preventDefault();
            handleToggle(currentEntry.id);
            break;
          }

          event.preventDefault();
          // Move focus to the parent folder, if any.
          const ancestors = findFolderAncestorPaths(currentEntry.id);
          const parentPath = ancestors[ancestors.length - 1];
          if (parentPath !== undefined) {
            const parentIsVisible = visibleNodes.some(
              (entry) => entry.id === parentPath,
            );
            if (parentIsVisible) {
              focusNodeById(parentPath);
            }
          }
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (currentEntry.kind === 'file') {
            onSelect(currentEntry.id);
          } else {
            handleToggle(currentEntry.id);
          }
          break;
        }
        default:
          break;
      }
    },
    [visibleNodes, focusedId, expanded, focusNodeById, handleToggle, onSelect],
  );

  // Make sure that when the active file changes, the tree expands its
  // ancestors so the active row is reachable in the visible flat list.
  useEffect(() => {
    if (activePath.length === 0) {
      return;
    }

    const ancestors = findFolderAncestorPaths(activePath);
    if (ancestors.length === 0) {
      return;
    }

    setExpanded((current) => {
      let changed = false;
      const next = new Set(current);
      for (const ancestor of ancestors) {
        if (!next.has(ancestor)) {
          next.add(ancestor);
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [activePath]);

  return (
    <div className="multi-file-code__tree">
      {rootLabel ? (
        <div className="multi-file-code__tree-root-label">{rootLabel}</div>
      ) : null}

      <ul
        role="tree"
        aria-label={rootLabel ?? 'File tree'}
        className="multi-file-code__tree-root"
        onKeyDown={handleKeyDown}
      >
        {tree.map((node) => (
          <NodeRow
            key={node.path}
            node={node}
            depth={0}
            expanded={expanded}
            activePath={activePath}
            focusedId={focusedId}
            onToggle={handleToggle}
            onSelect={onSelect}
            onFocusNode={setFocusedId}
            registerRow={registerRow}
          />
        ))}
      </ul>
    </div>
  );
}
