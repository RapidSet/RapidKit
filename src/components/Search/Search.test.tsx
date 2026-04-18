import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Search } from './Search';

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders with default placeholder', () => {
    render(<Search />);

    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('uses custom placeholder and calls onChange with string value', () => {
    const onChange = vi.fn();

    render(<Search placeholder="Search users" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('search-input'), {
      target: { value: 'alpha' },
    });

    expect(screen.getByPlaceholderText('Search users')).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith('alpha');
  });

  it('renders disabled when disabled is passed', () => {
    render(<Search disabled />);

    expect(
      (screen.getByLabelText('search-input') as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it('stops keydown propagation and calls consumer keydown handler', () => {
    const bodyKeyDown = vi.fn();
    const onKeyDown = vi.fn();

    document.body.addEventListener('keydown', bodyKeyDown);

    render(<Search onKeyDown={onKeyDown} />);

    fireEvent.keyDown(screen.getByLabelText('search-input'), { key: 'Enter' });

    expect(bodyKeyDown).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    document.body.removeEventListener('keydown', bodyKeyDown);
  });
});
