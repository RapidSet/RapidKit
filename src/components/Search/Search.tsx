import type { KeyboardEvent } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@lib/utils';
import { Input } from '@ui/input';
import type { SearchProps } from './types';

export function Search(props: Readonly<SearchProps>) {
  const {
    placeholder = 'Search...',
    value,
    onChange,
    className,
    disabled,
    inputClassName,
    onKeyDown,
    ariaLabel = 'search-input',
  } = props;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onKeyDown?.(event);
  };

  return (
    <div className={cn('relative w-72', className)}>
      <SearchIcon
        aria-hidden="true"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={handleKeyDown}
        {...(value !== undefined ? { value } : {})}
        className={cn(
          'pl-9 placeholder:text-xs placeholder:text-muted-foreground/60',
          inputClassName,
        )}
        disabled={disabled}
      />
    </div>
  );
}
