import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { Text } from './Text';

let allowsView = true;

const canAccess = vi.fn(
  (_: { action: string; subject: string; mode?: 'view' }, mode: 'view') => {
    if (mode !== 'view') {
      return false;
    }

    return allowsView;
  },
);

describe('Text', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    allowsView = true;
    canAccess.mockClear();
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
      <Text
        access={{ rules: [{ action: 'read', subject: 'copy' }] }}
        canAccess={canAccess}
      >
        Hidden text
      </Text>,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'copy' },
      'view',
    );
  });

  it('keeps text visible when rules exist but resolver is missing', () => {
    render(
      <Text access={{ rules: [{ action: 'read', subject: 'copy' }] }}>
        Visible fallback
      </Text>,
    );

    expect(screen.getByText('Visible fallback')).toBeTruthy();
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Text access={{ rules: [{ action: 'read', subject: 'copy' }] }}>
          Provider hidden text
        </Text>
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Text
          access={{ rules: [{ action: 'read', subject: 'copy' }] }}
          canAccess={() => true}
        >
          Provider override text
        </Text>
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('Provider override text')).toBeTruthy();
  });
});
