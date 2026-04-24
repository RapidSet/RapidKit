import { useEffect, useState } from 'react';
import type { UseDebounceOptions } from './types';

const defaultIsEqual = <T>(previous: T, next: T) => previous === next;

/**
 * Returns a debounced copy of a value.
 *
 * Improvements over the minimal variant:
 * - `enabled`: bypass debounce timing when false.
 * - `isEqual`: custom equality check to skip redundant updates.
 */
export function useDebounce<T>(
  value: T,
  delay: number,
  options?: UseDebounceOptions<T>,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const enabled = options?.enabled ?? true;
  const isEqual = options?.isEqual ?? defaultIsEqual<T>;
  const normalizedDelay = Math.max(0, Number.isFinite(delay) ? delay : 0);

  useEffect(() => {
    if (!enabled) {
      setDebouncedValue((previous) =>
        isEqual(previous, value) ? previous : value,
      );
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue((previous) =>
        isEqual(previous, value) ? previous : value,
      );
    }, normalizedDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [enabled, isEqual, normalizedDelay, value]);

  return debouncedValue;
}
