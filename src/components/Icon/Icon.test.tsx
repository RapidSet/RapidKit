import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Icon } from './Icon';

type MockIconProps = {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  'aria-label'?: string;
};

const MockIcon = ({
  className,
  size,
  strokeWidth,
  'aria-label': ariaLabel,
}: MockIconProps) => (
  <svg
    data-testid="icon-svg"
    className={className}
    data-size={size}
    data-stroke-width={strokeWidth}
    aria-label={ariaLabel}
  />
);

describe('Icon', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the provided icon component', () => {
    render(<Icon icon={MockIcon as never} />);

    expect(Boolean(screen.getByTestId('icon-svg'))).toBe(true);
  });

  it('forwards className and icon props', () => {
    render(
      <Icon
        icon={MockIcon as never}
        className="h-4 w-4 text-muted-foreground"
        size={20}
        strokeWidth={1.5}
        aria-label="Status icon"
      />,
    );

    const renderedIcon = screen.getByTestId('icon-svg');
    expect(renderedIcon.getAttribute('class')).toContain('h-4');
    expect(renderedIcon.dataset.size).toBe('20');
    expect(renderedIcon.dataset.strokeWidth).toBe('1.5');
    expect(renderedIcon.getAttribute('aria-label')).toBe('Status icon');
  });
});
