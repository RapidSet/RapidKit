import { forwardRef, type ComponentRef } from 'react';
import { useAccessResolver } from '@lib/use-access-resolver';
import { cn } from '@lib/utils';
import {
  Avatar as ShadcnAvatar,
  AvatarFallback as ShadcnAvatarFallback,
  AvatarImage as ShadcnAvatarImage,
} from '@ui/avatar';
import { resolveAvatarAccessState, resolveAvatarFallbackText } from './helpers';
import { avatarSizeClasses } from './styles';
import { AvatarProps } from './types';

export const Avatar = forwardRef<
  ComponentRef<typeof ShadcnAvatar>,
  AvatarProps
>((props, ref) => {
  const {
    src,
    alt,
    fallback,
    size = 'md',
    className,
    imageClassName,
    fallbackClassName,
    access,
    canAccess,
    ...rest
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);

  const { canView } = resolveAvatarAccessState(access, resolvedCanAccess);

  if (!canView) {
    return null;
  }

  return (
    <ShadcnAvatar
      ref={ref}
      className={cn(avatarSizeClasses[size], className)}
      {...rest}
    >
      <ShadcnAvatarImage
        src={src}
        alt={alt}
        className={cn('h-full w-full object-cover', imageClassName)}
      />
      <ShadcnAvatarFallback
        className={cn('text-xs font-medium uppercase', fallbackClassName)}
      >
        {fallback ?? resolveAvatarFallbackText(alt)}
      </ShadcnAvatarFallback>
    </ShadcnAvatar>
  );
});

Avatar.displayName = 'Avatar';
