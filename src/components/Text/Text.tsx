import { createElement } from 'react';
import { cn } from '@lib/utils';
import { TEXT_TONE_CLASS_NAMES, TEXT_WEIGHT_CLASS_NAMES } from './styles';
import { TextProps } from './types';

const resolveTextAccess = (
  requirements: string[] | undefined,
  resolveAccess: TextProps['resolveAccess'],
) => {
  const normalizedRequirements = requirements ?? [];
  const hasAccessResolver =
    normalizedRequirements.length > 0 && Boolean(resolveAccess);

  if (!hasAccessResolver) {
    return { hasViewPermission: true };
  }

  const hasViewPermission = normalizedRequirements.some((requirement) =>
    resolveAccess?.(requirement, 'view'),
  );

  return { hasViewPermission };
};

export function Text(props: Readonly<TextProps>) {
  const {
    as = 'span',
    tone = 'default',
    weight = 'regular',
    truncate = false,
    children,
    className,
    accessRequirements,
    resolveAccess,
    ...rest
  } = props;

  const { hasViewPermission } = resolveTextAccess(
    accessRequirements,
    resolveAccess,
  );

  if (!hasViewPermission) {
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
