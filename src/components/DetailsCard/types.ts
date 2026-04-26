import type { LucideIcon } from 'lucide-react';
import type { DetailsCardBodyTab } from './components/DetailsCardBody/types';
import type {
  ButtonAccessConfig,
  ButtonAccessResolver,
  ButtonVariant,
} from '@components/Button';

export interface CustomButton<T = unknown> {
  label: string;
  onClick: (data: T | null) => void;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  access?: ButtonAccessConfig;
  canAccess?: ButtonAccessResolver;
  loading?: boolean;
  disabled?: boolean;
}

export interface DetailsCardProps<T> {
  title: string;
  icon: LucideIcon;
  isLoading: boolean;
  isPolling?: boolean;
  data?: T;
  onSave?: (data: T | null) => void;
  onDelete?: (data: T | null) => void;
  onClose?: () => void;
  tabs?: DetailsCardBodyTab[];
  renderCustomContent?: () => React.ReactNode;
  saveAccess?: ButtonAccessConfig;
  deleteAccess?: ButtonAccessConfig;
  canAccess?: ButtonAccessResolver;
  customButtons?: CustomButton<T>[];
}
export interface DetailsCardAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: string;
}
