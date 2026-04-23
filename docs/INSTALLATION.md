# Installation Guide

Use this guide to install RapidKit in a consumer React application.

## Requirements

- Node.js 20+
- pnpm 9+
- React 19 application

## 1. Install RapidKit And Peer Dependencies

Install the package and all expected peers in one command:

```bash
pnpm add @rapidset/rapidkit @reduxjs/toolkit @tanstack/react-table react react-dom react-hook-form react-redux zod tailwindcss
```

## 2. Import Package Styles

Import the shared base stylesheet and exactly one theme stylesheet.

```tsx
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';
```

You can switch to another built-in theme by importing `@rapidset/rapidkit/themes/slate.css`, `@rapidset/rapidkit/themes/carbon.css`, or `@rapidset/rapidkit/themes/polaris.css` instead.

## 3. Use A Component

```tsx
import { Input } from '@rapidset/rapidkit';

export function ExampleForm() {
  return (
    <Input
      name="email"
      label="Email"
      value=""
      onChange={() => {}}
      placeholder="name@company.com"
    />
  );
}
```

## 4. Verify Peer Versions

RapidKit expects these peer ranges in your app:

- `react`: `^19.0.0`
- `react-dom`: `^19.0.0`
- `@reduxjs/toolkit`: `^2.0.0`
- `@tanstack/react-table`: `^8.0.0`
- `react-hook-form`: `^7.0.0`
- `react-redux`: `^9.0.0`
- `zod`: `^4.0.0`
- `tailwindcss`: `^4.0.0`

## Troubleshooting

### Missing Styles

If components render unstyled:

- Confirm `styles.css` is imported once in your app entry.
- Confirm exactly one RapidKit theme file is imported after `styles.css`.

### Peer Dependency Warnings

If your package manager reports peer conflicts:

- Upgrade app dependencies to match the peer ranges above.
- Reinstall dependencies (`pnpm install`) after updating versions.

## Next Steps

- Component docs: `/components/`
- Theming setup: `/THEMING`
- Theme configuration workflow: `/THEMING#theme-configuration-workflow`
