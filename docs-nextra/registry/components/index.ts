import type { RegistryEntry } from '../types';

export const COMPONENT_EXAMPLES = {} as const satisfies Record<
  string,
  RegistryEntry
>;

export type ComponentExampleId = keyof typeof COMPONENT_EXAMPLES;
