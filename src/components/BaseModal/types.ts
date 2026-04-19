import type { ReactNode } from 'react';
import type { ButtonVariant } from '@components/Button/styles';

export type BaseModalAccessMode = 'view' | 'action';

export type BaseModalAccessResolver = (
  requirement: string,
  mode: BaseModalAccessMode,
) => boolean;

export interface CustomButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  accessRequirements?: string[];
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  saveLabel?: string;
  cancelLabel?: string;
  showSave?: boolean;
  showCancel?: boolean;
  saveVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
  saveDisabled?: boolean;
  isLoading?: boolean;
  maxWidth?: string;
  className?: string;
  preventOutsideClose?: boolean;
  customButtons?: CustomButtonProps[];
  accessRequirements?: string[];
  saveAccessRequirements?: string[];
  resolveAccess?: BaseModalAccessResolver;
}
