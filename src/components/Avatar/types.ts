import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Avatar as ShadcnAvatar } from '@ui/avatar';
import type { AvatarSize } from './styles';

export type AvatarAccessMode = 'view';

export type AvatarAccessResolver = (
  requirement: string,
  mode: AvatarAccessMode,
) => boolean;

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
  accessRequirements?: string[];
  resolveAccess?: AvatarAccessResolver;
}
