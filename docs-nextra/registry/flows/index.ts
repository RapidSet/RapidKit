import type { RegistryEntry } from '../types';

export const FLOW_EXAMPLES = {} as const satisfies Record<
  string,
  RegistryEntry
>;

export type FlowExampleId = keyof typeof FLOW_EXAMPLES;
