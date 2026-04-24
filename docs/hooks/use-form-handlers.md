# useFormHandlers

`useFormHandlers` is a generic hook for managing controlled form values, touched/errors state, and submit/reset flow.

It supports:

- Native change events for input, textarea, and select.
- Checkbox boolean extraction from `checked`.
- Zod-compatible schema validation via `schema.safeParse`.
- Additional custom validation with `validate`.

## Login Composition Example

This example composes RapidKit components with `useFormHandlers` to build a login form.

```tsx
import { useState } from 'react';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  Input,
  Text,
  useFormHandlers,
} from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
  remember: z.boolean(),
});

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useFormHandlers<LoginValues>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    schema: loginSchema,
    validate: (values) => {
      if (values.password.includes(' ')) {
        return { password: 'Password cannot contain spaces.' };
      }

      return {};
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        console.log('Submitting login payload', values);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-card p-6"
      onSubmit={(event) => {
        void form.handleSubmit(event);
      }}
      noValidate
    >
      <div className="space-y-1">
        <Text as="h2" text="Welcome back" className="text-2xl font-semibold" />
        <Text
          as="p"
          text="Sign in using your RapidKit credentials"
          className="text-muted-foreground"
        />
      </div>

      <Input
        name="email"
        label="Email"
        value={form.values.email}
        onChange={form.handleFieldChange}
        onBlur={form.createBlurHandler('email')}
        error={form.touched.email ? form.errors.email : undefined}
        required
      />

      <Input
        name="password"
        type="password"
        label="Password"
        value={form.values.password}
        onChange={form.handleFieldChange}
        onBlur={form.createBlurHandler('password')}
        error={form.touched.password ? form.errors.password : undefined}
        required
      />

      <Checkbox
        name="remember"
        label="Remember me"
        checked={form.values.remember}
        onCheckedChange={(nextChecked) => {
          form.setFieldValue('remember', Boolean(nextChecked));
        }}
      />

      <Button
        type="submit"
        label={isSubmitting ? 'Signing In...' : 'Sign In'}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  );
}
```

## Validation Order

When both `schema` and `validate` are provided:

1. Schema errors are collected first.
2. `validate` errors are applied next.
3. If both define an error for the same field, `validate` wins.
