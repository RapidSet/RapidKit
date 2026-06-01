import type { Role } from './types';

/**
 * One source of truth for what each role can do. Keys are
 * `${action}:${subject}` strings so the resolver can answer
 * `canAccess({ action, subject })` with a single set lookup.
 */
export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<string>> = {
  admin: new Set([
    'read:report',
    'create:report',
    'export:report',
    'read:finance',
    'read:team',
    'read:settings',
    'read:activity',
    'update:activity',
  ]),
  viewer: new Set(['read:report', 'read:activity']),
};
