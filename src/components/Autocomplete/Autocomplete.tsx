import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@components/Input';
import { ScrollArea } from '@ui/scroll-area';
import { Skeleton } from '@ui/skeleton';
import { cn } from '@lib/utils';
import { DEFAULT_PAGINATION_PARAM } from '@lib/pagination';
import {
  AUTOCOMPLETE_EMPTY_QUERY,
  AUTOCOMPLETE_FALLBACK_PAGE,
  AUTOCOMPLETE_FALLBACK_PAGE_SIZE,
  AUTOCOMPLETE_SCROLL_THRESHOLD_PX,
} from './consts';
import { resolveAutocompleteAccessState } from './helpers';
import type { AutocompleteOptionBase, AutocompleteProps } from './types';

export function Autocomplete<T extends AutocompleteOptionBase>(
  props: Readonly<AutocompleteProps<T>>,
) {
  const {
    name,
    value,
    onSelectOption,
    searchOptions,
    getOptionById,
    disabled = false,
    placeholder = 'Search...',
    required = false,
    label,
    helperText,
    error,
    className,
    renderOption,
    getOptionLabel,
    emptyMessage = 'No results found',
    size = DEFAULT_PAGINATION_PARAM.size ?? AUTOCOMPLETE_FALLBACK_PAGE_SIZE,
    accessRequirements,
    resolveAccess,
  } = props;

  const { canView, canEdit } = resolveAutocompleteAccessState(
    accessRequirements,
    resolveAccess,
  );

  const [searchValue, setSearchValue] = useState(AUTOCOMPLETE_EMPTY_QUERY);
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(
    DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE,
  );
  const [totalPages, setTotalPages] = useState(
    DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE,
  );
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const listboxId = useId();

  const getLabel = useCallback(
    (item: T) => getOptionLabel?.(item) ?? item.name,
    [getOptionLabel],
  );

  const loadPage = useCallback(
    async (nextPage: number, append: boolean) => {
      const activeRequestId = ++requestIdRef.current;
      setIsLoading(true);

      try {
        const result = await searchOptions({
          query: searchValue,
          page: nextPage,
          size,
        });

        if (activeRequestId !== requestIdRef.current) {
          return;
        }

        setItems((previousItems) =>
          append ? [...previousItems, ...result.items] : result.items,
        );
        setPage(result.currentPage);
        setTotalPages(result.totalPages);
        setHasMore(result.currentPage < result.totalPages);
      } catch {
        if (activeRequestId !== requestIdRef.current) {
          return;
        }

        setItems([]);
        setHasMore(false);
        setPage(DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE);
        setTotalPages(
          DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE,
        );
      } finally {
        if (activeRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [searchOptions, searchValue, size],
  );

  useEffect(() => {
    if (!canView) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [canView]);

  useEffect(() => {
    if (!canView || !isOpen) {
      return;
    }

    setPage(DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE);
    setTotalPages(DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE);
    setHasMore(true);
    void loadPage(
      DEFAULT_PAGINATION_PARAM.page ?? AUTOCOMPLETE_FALLBACK_PAGE,
      false,
    );
  }, [canView, isOpen, loadPage]);

  useEffect(() => {
    if (!canView || value === null || value === undefined || !getOptionById) {
      if (value === null || value === undefined) {
        setSelectedItem(null);
      }
      return;
    }

    let active = true;
    setIsLoading(true);

    void getOptionById(value)
      .then((item) => {
        if (!active) {
          return;
        }

        setSelectedItem(item);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setSelectedItem(null);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [canView, getLabel, getOptionById, isOpen, value]);

  if (!canView) {
    return null;
  }

  const resolvedDisabled = disabled || !canEdit;

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setSearchValue(nextValue);
    if (nextValue.length === 0) {
      setSelectedItem(null);
      onSelectOption(null);
    }
    setIsOpen(true);
  };

  const handleDropdownClick = () => {
    if (resolvedDisabled) {
      return;
    }

    setIsOpen((previous) => {
      const next = !previous;
      if (next) {
        setSearchValue(AUTOCOMPLETE_EMPTY_QUERY);
      }
      return next;
    });
  };

  const handleItemClick = (item: T) => {
    setSelectedItem(item);
    setSearchValue(AUTOCOMPLETE_EMPTY_QUERY);
    onSelectOption(item);
    setIsOpen(false);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isLoading || !hasMore || page >= totalPages) {
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (
      scrollHeight - scrollTop - clientHeight <
      AUTOCOMPLETE_SCROLL_THRESHOLD_PX
    ) {
      void loadPage(page + 1, true);
    }
  };

  const showEmptyState = !isLoading && items.length === 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          name={name}
          value={searchValue || selectedItem?.name || AUTOCOMPLETE_EMPTY_QUERY}
          onChange={onQueryChange}
          placeholder={placeholder}
          disabled={resolvedDisabled}
          className={cn(resolvedDisabled && 'bg-accent')}
          label={label}
          required={required}
          helperText={helperText}
          error={error}
          endAdornment={
            <button
              type="button"
              onClick={handleDropdownClick}
              disabled={resolvedDisabled}
              aria-label={isOpen ? 'Close options' : 'Open options'}
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center text-muted-foreground transition-transform',
                !resolvedDisabled && 'cursor-pointer',
                resolvedDisabled && 'cursor-not-allowed opacity-60',
                isOpen && 'rotate-180',
              )}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          }
          onFocus={() => {
            if (!resolvedDisabled) {
              setSearchValue(AUTOCOMPLETE_EMPTY_QUERY);
              setIsOpen(true);
            }
          }}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
        />
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-10 rounded-md border shadow-md bg-background">
          <ScrollArea
            id={listboxId}
            className="max-h-[240px]"
            onScroll={handleScroll}
          >
            <ul className="m-0 list-none p-1" role="listbox">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="m-0 list-none border-b border-border last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="w-full rounded-sm bg-background p-2 text-left transition-colors hover:bg-accent/50"
                    aria-pressed={selectedItem?.id === item.id}
                  >
                    {renderOption ? renderOption(item) : getLabel(item)}
                  </button>
                </li>
              ))}
              {isLoading && (
                <li className="list-none py-2 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </li>
              )}
              {showEmptyState && (
                <li className="list-none p-2 text-center text-muted-foreground">
                  {emptyMessage}
                </li>
              )}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
