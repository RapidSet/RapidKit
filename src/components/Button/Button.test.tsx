import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
});
