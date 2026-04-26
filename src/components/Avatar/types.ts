import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';
import type { Avatar as ShadcnAvatar } from '@ui/avatar';
import type { AvatarSize } from './styles';

export type AvatarAccessMode = 'view';

export type AvatarAccessRule = AccessRule<AvatarAccessMode>;
export type AvatarAccessConfig = AccessConfig<AvatarAccessMode>;
export type AvatarAccessResolver = AccessResolver<
  AvatarAccessMode,
  AvatarAccessRule
>;

type AvatarPrimitiveProps = Omit<
  ComponentPropsWithoutRef<typeof ShadcnAvatar>,
  'children'
>;

export interface AvatarProps extends AvatarPrimitiveProps {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: AvatarSize;
  imageClassName?: string;
  fallbackClassName?: string;
  access?: AvatarAccessConfig;
  canAccess?: AvatarAccessResolver;
}
