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
      ['sidebar.write'],
      (_, mode) => mode === 'edit',
    );

    expect(state.canView).toBe(true);
    expect(state.canEdit).toBe(true);
  });

  it('denies view when read requirement fails', () => {
    const state = resolveSideBarAccessState(['sidebar.read'], () => false);

    expect(state.canView).toBe(false);
    expect(state.canEdit).toBe(false);
  });

  it('grants edit when at least one requirement passes', () => {
    const state = resolveSideBarAccessState(
      ['sidebar.write', 'settings.write'],
      (requirement, mode) =>
        mode === 'edit' && requirement === 'settings.write',
    );

    expect(state.canView).toBe(true);
    expect(state.canEdit).toBe(true);
  });
});

describe('entity visibility helpers', () => {
  const resolver = (requirement: string, mode: 'view' | 'edit') => {
    if (mode === 'view') {
      return requirement === 'menu.read';
    }
    return requirement === 'menu.write';
  };

  it('evaluates menu item view access', () => {
    expect(
      canViewMenuItem(
        {
          key: 'menu',
          label: 'Menu',
          accessRequirements: ['menu.read'],
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
          accessRequirements: ['menu.read'],
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
          accessRequirements: ['menu.read'],
        },
        resolver,
      ),
    ).toBe(true);
  });
});
