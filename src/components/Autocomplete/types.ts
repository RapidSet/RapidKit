import type { ReactNode } from 'react';
import type { PaginationParams } from '@lib/pagination';

export type AutocompleteId = string | number;

export interface AutocompleteOptionBase {
  id: AutocompleteId;
  name: string;
}

export interface AutocompleteSearchParams extends PaginationParams {
  query: string;
  page: number;
  size: number;
}

export interface AutocompleteSearchResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export type AutocompleteAccessMode = 'view' | 'edit';

export type AutocompleteAccessResolver = (
  requirement: string,
  mode: AutocompleteAccessMode,
) => boolean;

export interface AutocompleteProps<T extends AutocompleteOptionBase> {
  name: string;
  value: T['id'] | null;
  onSelectOption: (item: T | null) => void;
  searchOptions: (
    params: AutocompleteSearchParams,
  ) => Promise<AutocompleteSearchResult<T>>;
  getOptionById?: (id: T['id']) => Promise<T | null>;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  renderOption?: (item: T) => ReactNode;
  getOptionLabel?: (item: T) => string;
  emptyMessage?: string;
  size?: number;
  accessRequirements?: string[];
  resolveAccess?: AutocompleteAccessResolver;
}
