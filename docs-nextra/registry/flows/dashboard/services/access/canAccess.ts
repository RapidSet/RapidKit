import type { AccessResolver, AccessRule } from '@rapidset/rapidkit';
import { ROLE_PERMISSIONS } from './data';
import type { Role } from './types';

/**
 * Build a `canAccess` resolver from the current role. The resolver is
 * mode-agnostic — the action ("read" / "update" / "create" / "export")
 * already implies the mode, so we collapse `(rule, mode)` into a single
 * `action:subject` set lookup.
 *
 * In a real app, you'd swap this for a CASL adapter, a server-driven
 * permissions check, etc. — only the signature has to match.
 */
export function buildCanAccess(role: Role): AccessResolver {
  const permissions = ROLE_PERMISSIONS[role];
  return (rule: AccessRule) =>
    permissions.has(`${rule.action}:${rule.subject}`);
}
