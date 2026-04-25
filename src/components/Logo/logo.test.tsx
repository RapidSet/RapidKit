import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Logo } from './logo';

describe('Logo Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders icon and text by default when open is true', () => {
    render(<Logo open={true} />);

    const logoImage = screen.getByTestId('logo-logo');
    const logoText = screen.getByTestId('logo-text');
    expect(logoImage).toBeTruthy();
    expect(logoImage.getAttribute('src')).toBeTruthy();
    const src = logoImage.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toMatch(/icon\.svg/);
    expect(logoImage.getAttribute('alt')).toBe('Logo');
    expect(logoText.textContent).toBe('RapidKit');
  });

  it('renders icon only when open is false', () => {
    render(<Logo open={false} />);

    const iconImage = screen.getByTestId('logo-icon');
    expect(iconImage).toBeTruthy();
    expect(iconImage.getAttribute('src')).toBeTruthy();
    expect(iconImage.getAttribute('alt')).toBe('Logo');
    expect(screen.queryByTestId('logo-text')).toBeNull();
  });

  it('renders icon only when showIcon is true and showText is false', () => {
    render(<Logo showIcon={true} showText={false} open={true} />);

    const iconImage = screen.getByTestId('logo-icon');
    expect(iconImage).toBeTruthy();
    expect(iconImage.getAttribute('src')).toBeTruthy();
    expect(iconImage.getAttribute('alt')).toBe('Logo');
    expect(screen.queryByTestId('logo-text')).toBeNull();
  });

  it('renders logo without bordered container class', () => {
    render(<Logo open={true} />);

    const container = screen.getByTestId('logo-container');
    expect(container.className).not.toContain('border');
  });

  it('renders icon with correct classes for small size', () => {
    render(<Logo size="small" open={true} />);

    const logoImage = screen.getByTestId('logo-logo');
    expect(logoImage.className).toContain('h-4');
    expect(logoImage.className).toContain('w-4');
  });

  it('renders icon with correct classes for medium size', () => {
    render(<Logo size="medium" open={true} />);

    const logoImage = screen.getByTestId('logo-logo');
    expect(logoImage.className).toContain('h-5');
    expect(logoImage.className).toContain('w-5');
  });

  it('renders icon with correct classes for large size', () => {
    render(<Logo size="large" open={true} />);

    const logoImage = screen.getByTestId('logo-logo');
    expect(logoImage.className).toContain('h-6');
    expect(logoImage.className).toContain('w-6');
  });

  it('switches between expanded and collapsed states when open prop changes', () => {
    const { rerender } = render(<Logo open={true} />);

    const logoImage = screen.getByTestId('logo-logo');
    expect(logoImage).toBeTruthy();
    expect(screen.getByTestId('logo-text')).toBeTruthy();

    rerender(<Logo open={false} />);

    const iconImage = screen.getByTestId('logo-icon');
    expect(iconImage).toBeTruthy();
    expect(screen.queryByTestId('logo-logo')).toBeNull();
    expect(screen.queryByTestId('logo-text')).toBeNull();
  });

  it('renders with custom testId', () => {
    render(<Logo testId="custom-logo" open={true} />);

    const logoImage = screen.getByTestId('custom-logo-logo');
    expect(logoImage).toBeTruthy();
  });

  it('applies custom className', () => {
    render(<Logo className="custom-class" open={true} />);

    const logoImage = screen.getByTestId('logo-logo');
    expect(logoImage.className).toContain('custom-class');
  });

  it('renders custom brand text', () => {
    render(<Logo text="RapidSet" open={true} />);

    const logoText = screen.getByTestId('logo-text');
    expect(logoText.textContent).toBe('RapidSet');
  });
});
