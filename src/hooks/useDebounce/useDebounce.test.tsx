import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('alpha', 250));

    expect(result.current).toBe('alpha');
  });

  it('updates only after the configured delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      {
        initialProps: { value: 'alpha' },
      },
    );

    rerender({ value: 'beta' });
    expect(result.current).toBe('alpha');

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe('alpha');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('beta');
  });

  it('keeps only the latest value when changes happen rapidly', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      {
        initialProps: { value: 'a' },
      },
    );

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abc' });
    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('abc');
  });

  it('bypasses debouncing when enabled is false', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, enabled }) =>
        useDebounce(value, 300, {
          enabled,
        }),
      {
        initialProps: {
          value: 'alpha',
          enabled: false,
        },
      },
    );

    rerender({
      value: 'beta',
      enabled: false,
    });

    expect(result.current).toBe('beta');
  });

  it('supports custom equality checks to avoid redundant updates', () => {
    vi.useFakeTimers();

    type Option = { id: string; label: string };

    const initialValue: Option = {
      id: '1',
      label: 'One',
    };

    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebounce(value, 150, {
          isEqual: (previous, next) => previous.id === next.id,
        }),
      {
        initialProps: {
          value: initialValue,
        },
      },
    );

    const sameIdentityDifferentLabel: Option = {
      id: '1',
      label: 'Updated label',
    };

    rerender({ value: sameIdentityDifferentLabel });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe(initialValue);
  });
});
