import type { LucideIcon } from 'lucide-react';
import type { CustomButton } from '@components/DetailsCard/types';
import type {
  ButtonAccessConfig,
  ButtonAccessResolver,
} from '@components/Button';

export interface DetailsCardHeaderProps<T> {
  title: string;
  icon: LucideIcon;
  data?: T | null;
  onClose?: () => void;
  onSave?: (data: T | null) => void;
  onDelete?: (data: T | null) => void;
  saveAccess?: ButtonAccessConfig;
  deleteAccess?: ButtonAccessConfig;
  canAccess?: ButtonAccessResolver;
  customButtons?: CustomButton<T>[];
}
