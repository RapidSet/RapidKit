# Logo

## Purpose

Logo renders brand imagery for expanded and collapsed navigation states without coupling to any product-specific asset pipeline.

## Import

```tsx
import { Logo } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="logo" />

## Common Props

- `open?: boolean`
- `size?: 'small' | 'medium' | 'large'`
- `showIcon?: boolean`
- `showText?: boolean`
- `logoSrc?: string`
- `iconSrc?: string`
- `alt?: string`
- `className?: string`
- `testId?: string`

## Accessibility

- Renders a semantic image and forwards `alt` text for assistive technology.
- Use meaningful alt text for brand assets shown to end users.

## Usage

```tsx
import { Logo } from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export function BrandExamples() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Logo
        size="small"
        open
        showIcon
        showText
        logoSrc="/rapidkit.svg"
        iconSrc="/rapidkit.svg"
        alt="RapidKit logo"
      />

      <Logo
        size="medium"
        open={false}
        showIcon
        showText
        logoSrc="/rapidkit.svg"
        iconSrc="/rapidkit.svg"
        alt="RapidKit collapsed logo"
      />

      <Logo
        size="large"
        open
        showIcon
        showText
        logoSrc="/rapidkit.svg"
        iconSrc="/rapidkit.svg"
        alt="RapidKit large logo"
      />
    </div>
  );
}
```
