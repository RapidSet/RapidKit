# StatCard

## Purpose

Presentational KPI tile composed of a label, value, optional icon, optional trend chip, and optional description. Supports interactive drill-down through `onClick` and access-aware visibility and interactivity.

## Import

```tsx
import { StatCard } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="stat-card" />

## Common Props

- `label: string` — short metric label rendered above the value.
- `value: ReactNode` — primary metric value (formatted string or any node).
- `icon?: LucideIcon` — optional metric icon rendered next to the label.
- `delta?: string` — change indicator text rendered inside a `Chip`.
- `trend?: 'up' | 'down' | 'neutral'` — controls the delta chip's icon and color tokens. Default `'neutral'`.
- `description?: ReactNode` — secondary supporting text below the value.
- `onClick?: () => void` — when provided, the card becomes a button for drill-down navigation.
- `ariaLabel?: string` — accessible name override for the interactive form. Defaults to `label`.
- `className?: string` — additional classes on the outer container.
- `valueClassName?: string` — additional classes on the value `Text` element.
- `access?: StatCardAccessConfig`
- `canAccess?: StatCardAccessResolver`

## Accessibility

- When interactive, the card renders as a native `<button>` with an accessible name from `ariaLabel` or `label`, and supports focus-visible styling.
- When non-interactive, the card renders as a plain `<div>` so it does not announce as a control.

## Access Control

- No resolver or no rules: the card is fully visible and interactive.
- Read or view rules gate visibility — denied access returns `null`.
- Write or edit rules gate `onClick` — a denied edit downgrades the card to a non-interactive `<div>`.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).

## Usage

```tsx
import { StatCard } from '@rapidset/rapidkit';
import { Users } from 'lucide-react';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export function ActiveUsersTile() {
  return (
    <StatCard
      label="Active users"
      value="24,318"
      delta="+12.4%"
      trend="up"
      icon={Users}
      description="vs prior week"
      onClick={() => console.log('drill into users')}
    />
  );
}
```
