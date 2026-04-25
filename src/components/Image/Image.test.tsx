import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { Image } from './Image';

let canView = true;

const canAccess = vi.fn(
  (_: { action: string; subject: string; mode?: 'view' }, mode: 'view') =>
    mode === 'view' ? canView : false,
);

describe('Image', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canAccess.mockClear();
  });

  it('renders image element when src is provided', () => {
    render(<Image src="https://example.com/a.png" alt="Avatar" />);

    const image = screen.getByRole('img', {
      name: 'Avatar',
    }) as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('https://example.com/a.png');
  });

  it('forwards native img props', () => {
    render(
      <Image
        src="https://example.com/a.png"
        alt="Avatar"
        loading="lazy"
        data-testid="avatar-image"
      />,
    );

    const image = screen.getByTestId('avatar-image') as HTMLImageElement;
    expect(image.getAttribute('loading')).toBe('lazy');
  });

  it('renders fallback icon container when src is missing', () => {
    render(<Image alt="Missing" />);

    expect(document.querySelectorAll('svg').length > 0).toBe(true);
  });

  it('renders fallback icon after image load error', () => {
    render(<Image src="https://example.com/broken.png" alt="Broken" />);

    const image = screen.getByRole('img', { name: 'Broken' });
    fireEvent.error(image);

    expect(document.querySelectorAll('svg').length > 0).toBe(true);
  });

  it('hides image when view access is denied', () => {
    canView = false;

    render(
      <Image
        src="https://example.com/a.png"
        alt="Restricted"
        access={{ rules: [{ action: 'read', subject: 'media' }] }}
        canAccess={canAccess}
      />,
    );

    expect(screen.queryByRole('img', { name: 'Restricted' })).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'media' },
      'view',
    );
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Image
          src="https://example.com/a.png"
          alt="Provider Hidden"
          access={{ rules: [{ action: 'read', subject: 'media' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Image
          src="https://example.com/a.png"
          alt="Provider Override"
          access={{ rules: [{ action: 'read', subject: 'media' }] }}
          canAccess={() => true}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByRole('img', { name: 'Provider Override' })).toBeTruthy();
  });
});
