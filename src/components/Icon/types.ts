import type { LucideIcon, LucideProps } from 'lucide-react';

export type IconSource = LucideIcon | { default: LucideIcon };
export type IconVariant = 'primary' | 'danger' | 'success' | 'warning';

export interface IconProps extends LucideProps {
  icon: IconSource;
}
