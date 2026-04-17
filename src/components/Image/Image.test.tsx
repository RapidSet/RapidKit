import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
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
    render(
      <Image
        src="https://example.com/a.png"
        alt="Restricted"
        accessRequirements={['media.read']}
        resolveAccess={() => false}
      />,
    );

    expect(screen.queryByRole('img', { name: 'Restricted' })).toBeNull();
  });
});
