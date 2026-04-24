export type UseDebounceOptions<T> = {
  enabled?: boolean;
  isEqual?: (previous: T, next: T) => boolean;
};
