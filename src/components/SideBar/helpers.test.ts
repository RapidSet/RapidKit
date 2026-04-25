import { describe, expect, it } from 'vitest';
import {
  canViewMenuItem,
  canViewSubItem,
  canViewUserAction,
  resolveSideBarAccessState,
} from './helpers';

describe('resolveSideBarAccessState', () => {
  it('allows view when requirements are write-only', () => {
    const state = resolveSideBarAccessState(
      { rules: [{ action: 'write', subject: 'sidebar' }] },
      (_, mode) => mode === 'edit',
    );

    expect(state.canView).toBe(true);
    expect(state.canEdit).toBe(true);
  });

  it('denies view when read requirement fails', () => {
    const state = resolveSideBarAccessState(
      { rules: [{ action: 'read', subject: 'sidebar' }] },
      () => false,
    );

    expect(state.canView).toBe(false);
    expect(state.canEdit).toBe(true);
  });

  it('grants edit when at least one requirement passes', () => {
    const state = resolveSideBarAccessState(
      {
        rules: [
          { action: 'write', subject: 'sidebar' },
          { action: 'write', subject: 'settings' },
        ],
      },
      (rule, mode) => mode === 'edit' && rule.subject === 'settings',
    );

    expect(state.canView).toBe(true);
    expect(state.canEdit).toBe(true);
  });
});

describe('entity visibility helpers', () => {
  const resolver = (
    rule: { action: string; subject: string },
    mode: 'view' | 'edit',
  ) => {
    if (mode === 'view') {
      return rule.subject === 'menu' && rule.action === 'read';
    }
    return rule.subject === 'menu' && rule.action === 'write';
  };

  it('evaluates menu item view access', () => {
    expect(
      canViewMenuItem(
        {
          key: 'menu',
          label: 'Menu',
          access: { rules: [{ action: 'read', subject: 'menu' }] },
        },
        resolver,
      ),
    ).toBe(true);
  });

  it('evaluates submenu view access', () => {
    expect(
      canViewSubItem(
        {
          key: 'submenu',
          label: 'Sub Menu',
          access: { rules: [{ action: 'read', subject: 'menu' }] },
        },
        resolver,
      ),
    ).toBe(true);
  });

  it('evaluates user action view access', () => {
    expect(
      canViewUserAction(
        {
          key: 'logout',
          label: 'Logout',
          access: { rules: [{ action: 'read', subject: 'menu' }] },
        },
        resolver,
      ),
    ).toBe(true);
  });
});
