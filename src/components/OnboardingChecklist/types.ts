import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type OnboardingChecklistAccessMode = 'view' | 'edit';
export type OnboardingChecklistAccessRule =
  AccessRule<OnboardingChecklistAccessMode>;
export type OnboardingChecklistAccessConfig =
  AccessConfig<OnboardingChecklistAccessMode>;
export type OnboardingChecklistAccessResolver = AccessResolver<
  OnboardingChecklistAccessMode,
  OnboardingChecklistAccessRule
>;

export type OnboardingChecklistTone = 'primary' | 'success';

export interface OnboardingChecklistItem {
  id: string;
  label: ReactNode;
  done: boolean;
  description?: ReactNode;
  icon?: LucideIcon;
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export type OnboardingChecklistProps = Readonly<{
  title: ReactNode;
  items: OnboardingChecklistItem[];
  dismissible?: boolean;
  onDismiss?: () => void;
  progressTone?: OnboardingChecklistTone;
  className?: string;
  emptyState?: ReactNode;
  access?: OnboardingChecklistAccessConfig;
  canAccess?: OnboardingChecklistAccessResolver;
}>;
