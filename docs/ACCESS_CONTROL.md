# Access Control

## Purpose

RapidKit components use injectable access rules instead of coupling to any specific authorization library. This guide explains the shared `access` plus `canAccess` contract, provider inheritance with `RapidKitAccessProvider`, and a CASL adapter pattern.

## Shared Contract

Where supported, components accept:

- `access?: AccessConfig<TMode>`
- `canAccess?: AccessResolver<TMode, AccessRule<TMode>>`

`access` contains:

- `rules: AccessRule<TMode>[]`
- `match?: 'any' | 'all'`

Each rule uses a consistent object shape:

- `action: string`
- `subject: string`
- `mode?: TMode`

Common exported aliases are available for the most frequent access shapes:

- `ViewAccessConfig` and `ViewAccessResolver`
- `ViewEditAccessConfig` and `ViewEditAccessResolver`
- `ActionAccessConfig` and `ActionAccessResolver`

## Default Behavior

- No `access`: component stays visible and interactive.
- `access` without `canAccess`: component stays visible and interactive.
- View denied: visibility-gated components return `null`.
- Edit or action denied: interactive components stay visible but become disabled where applicable.

## Provider Inheritance

Use `RapidKitAccessProvider` when you want one resolver for a subtree.

```tsx
import {
  Button,
  Input,
  RapidKitAccessProvider,
  type RapidKitAccessRule,
} from '@rapidset/rapidkit';

const canAccess = (
  rule: RapidKitAccessRule,
  mode: 'view' | 'edit' | 'action',
) => {
  if (mode === 'view') {
    return rule.subject !== 'billing';
  }

  return rule.action !== 'delete';
};

export function AccessExample() {
  return (
    <RapidKitAccessProvider canAccess={canAccess}>
      <Input
        name="name"
        label="Name"
        value="RapidKit"
        onChange={() => {}}
        access={{ rules: [{ action: 'read', subject: 'profile' }] }}
      />

      <Button
        label="Delete"
        onClick={() => {}}
        access={{ rules: [{ action: 'delete', subject: 'project' }] }}
      />
    </RapidKitAccessProvider>
  );
}
```

Explicit `canAccess` props override the provider value.

## CASL Adapter

CASL fits this model cleanly because RapidKit already resolves access through `(action, subject)` pairs.

```tsx
import {
  RapidKitAccessProvider,
  type RapidKitAccessRule,
} from '@rapidset/rapidkit';
import { createContext, useContext } from 'react';
import type { AppAbility } from './ability';

const AbilityContext = createContext<AppAbility | null>(null);

function useRapidKitCanAccess() {
  const ability = useContext(AbilityContext);

  return (rule: RapidKitAccessRule) => {
    if (!ability) {
      return true;
    }

    return ability.can(rule.action, rule.subject);
  };
}

export function AppAccessProvider({ children }: { children: React.ReactNode }) {
  const canAccess = useRapidKitCanAccess();

  return (
    <RapidKitAccessProvider canAccess={canAccess}>
      {children}
    </RapidKitAccessProvider>
  );
}
```

## CASL Example

```tsx
import { Button, Input } from '@rapidset/rapidkit';

export function ProjectEditor() {
  return (
    <>
      <Input
        name="projectName"
        label="Project Name"
        value="Atlas"
        onChange={() => {}}
        access={{
          rules: [
            { action: 'read', subject: 'Project' },
            { action: 'update', subject: 'Project' },
          ],
          match: 'all',
        }}
      />

      <Button
        label="Archive Project"
        onClick={() => {}}
        access={{ rules: [{ action: 'archive', subject: 'Project' }] }}
      />
    </>
  );
}
```

In that setup:

- if CASL denies `read Project`, the input is hidden
- if CASL allows `read Project` but denies `update Project`, the input stays visible and becomes disabled
- if CASL denies `archive Project`, the button follows its configured access-denied behavior

## Match Semantics

- Use `match: 'any'` when any rule should grant access.
- Use `match: 'all'` when every rule must pass.

Example:

```tsx
access={{
  rules: [
    { action: 'read', subject: 'Project' },
    { action: 'update', subject: 'Project' },
  ],
  match: 'all',
}}
```

## Recommendations

- Prefer a single app-level provider over repeating `canAccess` props.
- Keep subjects domain-neutral and consistent with your CASL ability definitions.
- Use `view`, `edit`, and `action` semantics to match component behavior rather than inventing component-specific authorization modes in the app.
- Use explicit per-component `canAccess` only when a component must diverge from the default subtree policy.
