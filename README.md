# @rapidset/rapidkit

<p align="center">
  <img src="https://raw.githubusercontent.com/RapidSet/RapidKit/main/public/rapidkit.svg" alt="RapidKit" width="180" />
</p>

AI-first React UI component kit for production-grade application interfaces.

RapidKit gives teams beautifully designed, accessible, typed, enterprise-ready components that are already themed and built for AI-assisted development. It is designed to make production-grade code generation easier with predictable APIs, contract-aligned documentation, and AI-friendly tooling.

It is built on top of proven technologies including shadcn/ui, Radix UI, Zod, RTK Query, TanStack, and Tailwind CSS.

[![npm version](https://img.shields.io/npm/v/@rapidset/rapidkit)](https://www.npmjs.com/package/@rapidset/rapidkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/RapidSet/RapidKit/blob/main/LICENSE)

## Why RapidKit

- Reusable, domain-neutral components designed for package consumers.
- Strong TypeScript APIs and accessibility-first interaction patterns.
- Theme-ready styling with semantic tokens.
- AI-friendly docs and contracts for predictable code generation.

## Installation

Choose your package manager:

```bash
pnpm add @rapidset/rapidkit react react-dom @reduxjs/toolkit @tanstack/react-table react-redux react-hook-form zod tailwindcss
```

```bash
npm install @rapidset/rapidkit react react-dom @reduxjs/toolkit @tanstack/react-table react-redux react-hook-form zod tailwindcss
```

```bash
yarn add @rapidset/rapidkit react react-dom @reduxjs/toolkit @tanstack/react-table react-redux react-hook-form zod tailwindcss
```

## Compatibility

- React: 18 or 19
- React DOM: 18 or 19
- Tailwind CSS: 3 or 4
- TypeScript declarations included in package output

## Included Components

- Autocomplete
- Avatar
- BaseModal
- BaseTable
- Button
- Checkbox
- Chip
- DatePicker
- DetailsCard
- DropDown
- Icon
- Image
- Input
- Page
- Search
- Text
- TextArea
- Toggle

## Quick Start

```tsx
import { Button, Input } from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export function Example() {
  return (
    <div className="space-y-3">
      <Input name="email" label="Email" value="" onChange={() => {}} />
      <Button label="Continue" onClick={() => {}} />
    </div>
  );
}
```

## AI Import Contract

To keep AI-generated code reliable and consistent, use exactly this import model:

- Import all components as named exports from `@rapidset/rapidkit`.
- Import package styles from `@rapidset/rapidkit/styles.css`.
- Import one theme from `@rapidset/rapidkit/themes/*`.

Allowed:

```tsx
import { Button, Input, TextArea } from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';
```

Not allowed:

```tsx
import { Button } from '@rapidset/rapidkit/dist/index.js';
import { Button } from '@rapidset/rapidkit/components/Button';
import { Button } from '@rapidset/rapidkit/src/components/Button';
```

## Documentation

- Components: https://rapidset.github.io/RapidKit/components/
- Theming: https://rapidset.github.io/RapidKit/THEMING
- Architecture: https://rapidset.github.io/RapidKit/ARCHITECTURE

## Packages

- `@rapidset/rapidkit`: publishable React UI component library

## License

MIT
