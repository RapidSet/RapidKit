import { createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MoreVertical } from 'lucide-react';
import { Button } from './Button';
import { ButtonVariant } from './styles';

describe('Button', () => {
  it('renders label and calls onClick when clicked', () => {
    const onClick = vi.fn();

    render(<Button label="Save" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders children when label is not provided', () => {
    render(<Button>Custom Child</Button>);

    expect(screen.getByRole('button', { name: 'Custom Child' })).toBeTruthy();
  });

  it('forwards refs to the native button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref} label="Focusable" />);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Focusable' }));
  });

  it('hides the button when action access is denied and hide behavior is used', () => {
    render(
      <Button
        label="Restricted"
        accessRequirements={['action.delete']}
        resolveAccess={() => false}
        accessDeniedBehavior="hide"
      />,
    );

    expect(screen.queryByRole('button', { name: 'Restricted' })).toBeNull();
  });

  it('disables the button when action access is denied and disable behavior is used', () => {
    render(
      <Button
        label="Locked"
        accessRequirements={['action.delete']}
        resolveAccess={(_, mode) => mode !== 'action'}
      />,
    );

    expect(screen.getByRole('button', { name: 'Locked' })).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('requires all action requirements to pass before enabling the button', () => {
    render(
      <Button
        label="Publish"
        accessRequirements={['article.publish', 'article.approve']}
        resolveAccess={(requirement) => requirement === 'article.publish'}
      />,
    );

    expect(screen.getByRole('button', { name: 'Publish' })).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('disables button and shows spinner when loading is true', () => {
    render(<Button label="Loading" loading />);

    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toHaveProperty('disabled', true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.animate-spin')).toBeTruthy();
  });

  it('renders left icon only when not loading', () => {
    const { rerender } = render(
      <Button label="Icon button" leftIcon={MoreVertical} />,
    );

    let button = screen.getByRole('button', { name: 'Icon button' });
    expect(button.querySelector('svg')).toBeTruthy();

    rerender(<Button label="Icon button" leftIcon={MoreVertical} loading />);

    button = screen.getByRole('button', { name: 'Icon button' });
    expect(button.querySelector('.animate-spin')).toBeTruthy();
    expect(button.querySelectorAll('svg')).toHaveLength(1);
  });

  it('renders right icon when provided', () => {
    render(<Button label="Next" rightIcon={MoreVertical} />);

    const button = screen.getByRole('button', { name: 'Next' });
    expect(button.querySelectorAll('svg')).toHaveLength(1);
  });

  it('renders both left and right icons when both are provided', () => {
    render(
      <Button
        label="Navigate"
        leftIcon={MoreVertical}
        rightIcon={MoreVertical}
      />,
    );

    const button = screen.getByRole('button', { name: 'Navigate' });
    expect(button.querySelectorAll('svg')).toHaveLength(2);
  });

  it('applies dashed and text variants with semantic styles', () => {
    const { rerender } = render(
      <Button label="Dashed" variant={ButtonVariant.Dashed} />,
    );

    let button = screen.getByRole('button', { name: 'Dashed' });
    expect(button.className).toContain('border-dashed');

    rerender(<Button label="Text" variant={ButtonVariant.Text} />);

    button = screen.getByRole('button', { name: 'Text' });
    expect(button.className).toContain('underline-offset-4');
  });

  it('applies unique class styles for every public button variant', () => {
    const variantExpectations: Array<[ButtonVariant, string, string]> = [
      [ButtonVariant.Primary, 'Primary', 'bg-primary'],
      [ButtonVariant.Default, 'Default', 'bg-secondary'],
      [ButtonVariant.Dashed, 'Dashed', 'border-dashed'],
      [ButtonVariant.Outlined, 'Outlined', 'bg-transparent'],
      [ButtonVariant.Text, 'Text', 'rounded-none'],
      [ButtonVariant.Icon, 'Icon', 'w-8'],
      [ButtonVariant.Destructive, 'Destructive', 'bg-destructive'],
    ];

    for (const [variant, label, expectedClass] of variantExpectations) {
      render(<Button label={label} variant={variant} />);
      const button = screen.getByRole('button', { name: label });
      expect(button.className).toContain(expectedClass);
      cleanup();
    }
  });

  it('keeps a visible border for non-text, non-icon variants at rest', () => {
    const variantsWithBorder: Array<[ButtonVariant, string]> = [
      [ButtonVariant.Primary, 'Primary with border'],
      [ButtonVariant.Default, 'Default with border'],
      [ButtonVariant.Dashed, 'Dashed with border'],
      [ButtonVariant.Outlined, 'Outlined with border'],
      [ButtonVariant.Destructive, 'Destructive with border'],
    ];

    for (const [variant, label] of variantsWithBorder) {
      render(<Button label={label} variant={variant} />);
      const button = screen.getByRole('button', { name: label });
      expect(button.className).toContain('border');
      cleanup();
    }
  });

  it('keeps icon variant borderless at rest', () => {
    render(<Button label="Icon borderless" variant={ButtonVariant.Icon} />);

    const button = screen.getByRole('button', { name: 'Icon borderless' });
    expect(button.className).not.toContain('border');
  });

  it('keeps default, dashed, and outlined variants flat without elevation', () => {
    const flatVariants: Array<[ButtonVariant, string]> = [
      [ButtonVariant.Default, 'Default flat'],
      [ButtonVariant.Dashed, 'Dashed flat'],
      [ButtonVariant.Outlined, 'Outlined flat'],
    ];

    for (const [variant, label] of flatVariants) {
      render(<Button label={label} variant={variant} />);
      const button = screen.getByRole('button', { name: label });
      expect(button.className).toContain('shadow-none');
      expect(button.className).toContain('hover:shadow-none');
      cleanup();
    }
  });

  it('uses theme-safe hover text colors for default, dashed, and outlined variants', () => {
    const hoverTextExpectations: Array<[ButtonVariant, string, string]> = [
      [
        ButtonVariant.Default,
        'Default hover text',
        'hover:text-secondary-foreground',
      ],
      [ButtonVariant.Dashed, 'Dashed hover text', 'hover:text-foreground'],
      [ButtonVariant.Outlined, 'Outlined hover text', 'hover:text-foreground'],
    ];

    for (const [variant, label, expectedClass] of hoverTextExpectations) {
      render(<Button label={label} variant={variant} />);
      const button = screen.getByRole('button', { name: label });
      expect(button.className).toContain(expectedClass);
      expect(button.className).not.toContain('hover:text-accent-foreground');
      cleanup();
    }
  });

  it('uses control-like rounded-sm corners for non-text variants', () => {
    const roundedVariants: Array<[ButtonVariant, string]> = [
      [ButtonVariant.Primary, 'Primary radius'],
      [ButtonVariant.Default, 'Default radius'],
      [ButtonVariant.Dashed, 'Dashed radius'],
      [ButtonVariant.Outlined, 'Outlined radius'],
      [ButtonVariant.Icon, 'Icon radius'],
      [ButtonVariant.Destructive, 'Destructive radius'],
    ];

    for (const [variant, label] of roundedVariants) {
      render(<Button label={label} variant={variant} />);
      const button = screen.getByRole('button', { name: label });
      expect(button.className).toContain('rounded-sm');
      cleanup();
    }
  });

  it('keeps text variant with rounded-none corners', () => {
    render(<Button label="Text radius" variant={ButtonVariant.Text} />);

    const button = screen.getByRole('button', { name: 'Text radius' });
    expect(button.className).toContain('rounded-none');
  });
});
