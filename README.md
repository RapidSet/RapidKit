# @rapidset/rapidkit

React UI component library for building accessible, reusable app interfaces.

[![npm version](https://img.shields.io/npm/v/@rapidset/rapidkit)](https://www.npmjs.com/package/@rapidset/rapidkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/RapidSet/RapidKit/blob/main/LICENSE)

## Installation

Install the package and peer dependencies:

```bash
pnpm add @rapidset/rapidkit react react-dom @reduxjs/toolkit @tanstack/react-table react-redux react-hook-form zod tailwindcss
```

## Peer Dependencies

- react: ^18.0.0 || ^19.0.0
- react-dom: ^18.0.0 || ^19.0.0
- @reduxjs/toolkit: ^2.0.0
- @tanstack/react-table: ^8.0.0
- react-redux: ^9.0.0
- react-hook-form: ^7.0.0
- zod: ^3.0.0
- tailwindcss: ^3.0.0 || ^4.0.0

## Quick Start

```tsx
import { Input } from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export function Example() {
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

## Components

Current root exports:

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
- version

Type exports are available from component modules (for example, `InputProps`, `ButtonProps`, and `ChipProps`).

## Styles And Themes

- Base styles: `@rapidset/rapidkit/styles.css`
- Built-in themes: `@rapidset/rapidkit/themes/default.css`, `@rapidset/rapidkit/themes/slate.css`, `@rapidset/rapidkit/themes/carbon.css`, `@rapidset/rapidkit/themes/polaris.css`

Import base styles once, then import one theme.

## Documentation

- Component docs: https://rapidset.github.io/RapidKit/components/
- Theming guide: https://github.com/RapidSet/RapidKit/blob/main/docs/THEMING.md
- Components index: https://github.com/RapidSet/RapidKit/blob/main/docs/COMPONENTS.md
- Installation guide: https://github.com/RapidSet/RapidKit/blob/main/docs/INSTALLATION.md

## Contributing

Contribution guidelines are available at https://github.com/RapidSet/RapidKit/blob/main/docs/CONTRIBUTING.md.

## License

MIT
