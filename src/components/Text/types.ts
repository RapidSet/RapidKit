import * as React from 'react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type TextAccessMode = 'view';
export type TextAccessRule = AccessRule<TextAccessMode>;
export type TextAccessConfig = AccessConfig<TextAccessMode>;
export type TextAccessResolver = AccessResolver<TextAccessMode, TextAccessRule>;

export type TextElement = 'span' | 'p' | 'small' | 'strong' | 'div';

export type TextTone = 'default' | 'muted' | 'destructive' | 'success';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

type BaseTextProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'color'
>;

export type TextProps = BaseTextProps & {
  children: React.ReactNode;
  as?: TextElement;
  tone?: TextTone;
  weight?: TextWeight;
  truncate?: boolean;
  access?: TextAccessConfig;
  canAccess?: TextAccessResolver;
};
