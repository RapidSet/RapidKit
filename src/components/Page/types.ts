import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type {
  ButtonAccessDeniedBehavior,
  ButtonAccessResolver,
  ButtonVariant,
} from '../Button';

export interface PageAction {
  name: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  disabled?: boolean;
  accessRequirements?: string[];
  resolveAccess?: ButtonAccessResolver;
  accessDeniedBehavior?: ButtonAccessDeniedBehavior;
}

export interface PageProps {
  children: ReactNode;
  actions?: PageAction[];
  className?: string;
  onSearch?: (value: string) => void;
  enableSearch?: boolean;
  filterSlot?: ReactNode;
  searchPlaceholder?: string;
}
