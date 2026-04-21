import * as React from 'react';

export type TextAccessMode = 'view';

export type TextAccessResolver = (
  requirement: string,
  mode: TextAccessMode,
) => boolean;

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
  accessRequirements?: string[];
  resolveAccess?: TextAccessResolver;
};
