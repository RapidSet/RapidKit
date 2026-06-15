import type { FormFieldKind } from './types';

export const resolveFieldKind = (
  value: unknown,
  override: FormFieldKind | undefined,
): 'text' | 'checkbox' => {
  if (override && override !== 'auto') {
    return override;
  }
  return typeof value === 'boolean' ? 'checkbox' : 'text';
};

export const buildFieldId = (
  formId: string | undefined,
  name: string,
): string => `${formId ?? 'rk-form'}-${name}`;
