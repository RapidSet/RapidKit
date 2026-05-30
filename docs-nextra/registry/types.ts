import type { ComponentType } from 'react';

export type RegistryEntry = Readonly<{
  component: string;
  file: string;
  title: string;
  full?: boolean;
  load: () => Promise<{ default: ComponentType }>;
}>;
