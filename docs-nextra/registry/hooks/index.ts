import type { RegistryEntry } from '../types';

export const HOOK_EXAMPLES = {} as const satisfies Record<
  string,
  RegistryEntry
>;

export type HookExampleId = keyof typeof HOOK_EXAMPLES;
