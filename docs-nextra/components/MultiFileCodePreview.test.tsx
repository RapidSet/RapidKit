import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, fireEvent, within } from '@testing-library/react';
import {
  MultiFileCodePreview,
  type MultiFileCodePreviewFile,
} from './MultiFileCodePreview';

vi.mock('./useShikiHtml', () => ({
  useShikiHtml: () => '',
}));

const FILES: readonly MultiFileCodePreviewFile[] = [
  { path: 'LoginPage.tsx', content: 'export const LoginPage = () => null;\n' },
  { path: 'LoginForm.tsx', content: 'export const LoginForm = () => null;\n' },
  { path: 'data/providers.ts', content: 'export const PROVIDERS = [];\n' },
];

function setupClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

function getPathText(container: HTMLElement): string {
  const span = container.querySelector('.multi-file-code__path-text');
  return span?.textContent ?? '';
}

function getActiveCode(container: HTMLElement): string {
  const codeBlock = container.querySelector('.multi-file-code__scroll');
  return codeBlock?.textContent ?? '';
}

function getFileRow(container: HTMLElement, fileName: string): HTMLElement {
  const rows = Array.from(
    container.querySelectorAll<HTMLElement>(
      '.multi-file-code__tree-node--file',
    ),
  );
  const match = rows.find((row) =>
    within(row).queryByText(fileName, { exact: true }),
  );
  if (!match) {
    throw new Error(`File row "${fileName}" not found`);
  }
  return match;
}

describe('MultiFileCodePreview', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('shows the first file when defaultPath is omitted', () => {
    const { container } = render(
      <MultiFileCodePreview files={FILES} rootLabel="flows/login" />,
    );

    expect(getPathText(container)).toBe('flows/login/LoginPage.tsx');
    expect(getActiveCode(container)).toContain(FILES[0].content.trim());
  });

  it('honors defaultPath when it matches a file', () => {
    const { container } = render(
      <MultiFileCodePreview
        files={FILES}
        rootLabel="flows/login"
        defaultPath="LoginForm.tsx"
      />,
    );

    expect(getPathText(container)).toBe('flows/login/LoginForm.tsx');
    expect(getActiveCode(container)).toContain(FILES[1].content.trim());
  });

  it('falls back to the first file when defaultPath is unknown', () => {
    const { container } = render(
      <MultiFileCodePreview
        files={FILES}
        rootLabel="flows/login"
        defaultPath="nonexistent.tsx"
      />,
    );

    expect(getPathText(container)).toBe('flows/login/LoginPage.tsx');
  });

  it('switches the active file when a tree item is clicked', () => {
    const { container } = render(
      <MultiFileCodePreview files={FILES} rootLabel="flows/login" />,
    );

    fireEvent.click(getFileRow(container, 'LoginForm.tsx'));

    expect(getPathText(container)).toBe('flows/login/LoginForm.tsx');
    expect(getActiveCode(container)).toContain(FILES[1].content.trim());
  });

  it('copies only the active file content', async () => {
    const writeText = setupClipboard();
    const { container } = render(
      <MultiFileCodePreview
        files={FILES}
        rootLabel="flows/login"
        defaultPath="LoginForm.tsx"
      />,
    );

    const copyButton = container.querySelector<HTMLButtonElement>(
      '.multi-file-code__copy',
    );
    expect(copyButton).not.toBeNull();
    fireEvent.click(copyButton!);

    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1);
    });
    expect(writeText).toHaveBeenCalledWith(FILES[1].content);
  });
});
