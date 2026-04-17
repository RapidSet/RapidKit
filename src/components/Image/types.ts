import type * as React from 'react';

export type ImageAccessMode = 'view' | 'edit';

export type ImageAccessResolver = (
  requirement: string,
  mode: ImageAccessMode,
) => boolean;

export type ImageProps = React.ComponentPropsWithoutRef<'img'> & {
  size?: 'sm' | 'md' | 'lg';
  accessRequirements?: string[];
  resolveAccess?: ImageAccessResolver;
};
