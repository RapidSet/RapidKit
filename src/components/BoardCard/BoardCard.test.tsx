import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LayoutGrid } from 'lucide-react';
import { BoardCard } from './BoardCard';

describe('BoardCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and default preview', () => {
    render(<BoardCard title="Tasks" />);

    expect(screen.getByText('Tasks')).toBeTruthy();
  });

  it('renders the icon when provided', () => {
    render(<BoardCard title="Tasks" icon={LayoutGrid} />);

    const heading = screen.getByText('Tasks');
    const wrapper = heading.parentElement;
    expect(wrapper?.querySelector('svg')).toBeTruthy();
  });

  it('renders breadcrumb joined with >', () => {
    render(
      <BoardCard
        title="Tasks"
        breadcrumb={['monday dev', 'My Team', 'Tasks']}
      />,
    );

    expect(screen.getByText('monday dev > My Team > Tasks')).toBeTruthy();
  });

  it('fires onClick when the card is interactive', () => {
    const onClick = vi.fn();

    render(<BoardCard title="Tasks" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: /tasks/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onStarToggle independently from card onClick', () => {
    const onClick = vi.fn();
    const onStarToggle = vi.fn();

    render(
      <BoardCard title="Tasks" onClick={onClick} onStarToggle={onStarToggle} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /star/i }));
    expect(onStarToggle).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('reflects starred state on the toggle', () => {
    render(<BoardCard title="Tasks" starred onStarToggle={() => undefined} />);

    const button = screen.getByRole('button', { name: /unstar/i });
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('returns null when view access is denied', () => {
    const { container } = render(
      <BoardCard
        title="Hidden"
        access={{ rules: [{ action: 'read', subject: 'board' }] }}
        canAccess={() => false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders an anchor when href is provided', () => {
    render(<BoardCard title="Tasks" href="/tasks" onClick={() => undefined} />);

    const link = screen.getByRole('link', { name: /tasks/i });
    expect(link.getAttribute('href')).toBe('/tasks');
  });
});
