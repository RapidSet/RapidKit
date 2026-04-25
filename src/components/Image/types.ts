import type * as React from 'react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type ImageAccessMode = 'view';
export type ImageAccessRule = AccessRule<ImageAccessMode>;
export type ImageAccessConfig = AccessConfig<ImageAccessMode>;
export type ImageAccessResolver = AccessResolver<
  ImageAccessMode,
  ImageAccessRule
>;

export type ImageProps = React.ComponentPropsWithoutRef<'img'> & {
  size?: 'sm' | 'md' | 'lg';
  access?: ImageAccessConfig;
  canAccess?: ImageAccessResolver;
};
