import { ShieldCheck, User } from 'lucide-react';
import type { RoleOption } from './types';

export const ROLE_OPTIONS: ReadonlyArray<RoleOption> = [
  { role: 'admin', label: 'Admin', icon: ShieldCheck },
  { role: 'viewer', label: 'Viewer', icon: User },
];
