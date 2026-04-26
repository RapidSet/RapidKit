import type { ReactNode } from 'react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';
import type { ButtonVariant } from '@components/Button/styles';

export type BaseModalAccessMode = 'view' | 'action';
export type BaseModalAccessRule = AccessRule<BaseModalAccessMode>;
export type BaseModalAccessConfig = AccessConfig<BaseModalAccessMode>;
export type BaseModalAccessResolver = AccessResolver<
  BaseModalAccessMode,
  BaseModalAccessRule
>;

export interface CustomButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  access?: BaseModalAccessConfig;
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
  access?: BaseModalAccessConfig;
  saveAccess?: BaseModalAccessConfig;
  canAccess?: BaseModalAccessResolver;
}
