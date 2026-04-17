import type { ReactNode } from 'react';
import type { PageAction } from '../../types';

export interface PageHeaderProps {
  actions?: PageAction[];
  onSearch?: (value: string) => void;
  className?: string;
  filterSlot?: ReactNode;
  searchPlaceholder?: string;
}
