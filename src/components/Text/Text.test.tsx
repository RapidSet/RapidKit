import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Text } from './Text';

let allowsView = true;

const resolveAccess = vi.fn((_: string, mode: 'view') => {
  if (mode !== 'view') {
    return false;
  }

  return allowsView;
});

describe('Text', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    allowsView = true;
    resolveAccess.mockClear();
  });

  it('renders content with default styles', () => {
    render(<Text>Overview copy</Text>);

    const element = screen.getByText('Overview copy');
    expect(element.tagName).toBe('SPAN');
    expect(element.className).toContain('text-foreground');
    expect(element.className).toContain('font-normal');
  });

  it('renders as selected HTML element', () => {
    render(<Text as="p">Paragraph copy</Text>);

    const element = screen.getByText('Paragraph copy');
    expect(element.tagName).toBe('P');
  });

  it('applies tone, weight, truncate and className', () => {
    render(
      <Text tone="muted" weight="semibold" truncate className="custom-text">
        Truncated copy
      </Text>,
    );

    const element = screen.getByText('Truncated copy');
    expect(element.className).toContain('text-muted-foreground');
    expect(element.className).toContain('font-semibold');
    expect(element.className).toContain('truncate');
    expect(element.className).toContain('custom-text');
  });

  it('remains visible when access checks are omitted', () => {
    render(<Text>Visible text</Text>);

    expect(screen.getByText('Visible text')).toBeTruthy();
  });

  it('hides text when access is denied', () => {
    allowsView = false;

    const { container } = render(
      <Text accessRequirements={['copy.read']} resolveAccess={resolveAccess}>
        Hidden text
      </Text>,
    );

    expect(container.firstChild).toBeNull();
    expect(resolveAccess).toHaveBeenCalledWith('copy.read', 'view');
  });

  it('keeps text visible when requirements exist but resolver is missing', () => {
    render(<Text accessRequirements={['copy.read']}>Visible fallback</Text>);

    expect(screen.getByText('Visible fallback')).toBeTruthy();
  });
});
