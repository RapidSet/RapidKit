import { createElement } from 'react';
import { useAccessResolver } from '@lib/use-access-resolver';
import { cn } from '@lib/utils';
import { resolveViewAccessState } from '@lib/view-edit-access';
import { TEXT_TONE_CLASS_NAMES, TEXT_WEIGHT_CLASS_NAMES } from './styles';
import { TextProps } from './types';

export function Text(props: Readonly<TextProps>) {
  const {
    as = 'span',
    tone = 'default',
    weight = 'regular',
    truncate = false,
    children,
    className,
    access,
    canAccess,
    ...rest
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);
  const { canView } = resolveViewAccessState(access, resolvedCanAccess);

  if (!canView) {
    return null;
  }

  return createElement(
    as,
    {
      ...rest,
      className: cn(
        'text-[length:var(--rk-control-font-size)] leading-normal',
        TEXT_TONE_CLASS_NAMES[tone],
        TEXT_WEIGHT_CLASS_NAMES[weight],
        truncate && 'truncate',
        className,
      ),
    },
    children,
  );
}
