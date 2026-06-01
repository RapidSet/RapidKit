import { ArrowRight, KeyRound } from 'lucide-react';
import {
  Button,
  ButtonVariant,
  Checkbox,
  Input,
  Text,
} from '@rapidset/rapidkit';
import { LOGIN_PROVIDERS } from './consts';
import type { LoginFormProps } from './types';

export function LoginForm({ form, submitMessage }: LoginFormProps) {
  return (
    <form
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
      onSubmit={(event) => {
        void form.handleSubmit(event);
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
          <KeyRound className="h-5 w-5 text-foreground" aria-hidden="true" />
        </div>
        <div>
          <Text as="p" className="text-lg font-semibold text-foreground">
            Welcome back
          </Text>
          <Text as="p" tone="muted" className="text-sm">
            Sign in to continue into your workspace.
          </Text>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {LOGIN_PROVIDERS.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant={ButtonVariant.Outlined}
            label={provider}
            className="w-full justify-center"
          />
        ))}
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <Text
          as="p"
          tone="muted"
          className="text-xs uppercase tracking-[0.18em]"
        >
          Or use password
        </Text>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-4">
        <Input
          {...form.getTextFieldProps('email')}
          type="email"
          label="Work Email"
          placeholder="name@company.com"
        />
        <Input
          {...form.getTextFieldProps('password')}
          type="password"
          label="Password"
          placeholder="Enter your password"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Checkbox
          {...form.getCheckboxFieldProps('remember')}
          title="Remember me"
        />
        <button type="button" className="text-sm font-medium text-primary">
          Forgot password?
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="submit"
          variant={ButtonVariant.Primary}
          rightIcon={ArrowRight}
          label="Sign In"
          className="w-full justify-center"
        />
        {submitMessage ? (
          <Text as="p" tone="success" className="text-center text-sm">
            {submitMessage}
          </Text>
        ) : null}
        <Text as="p" tone="muted" className="text-center text-sm">
          Need an account? Request an invitation from your workspace admin.
        </Text>
      </div>
    </form>
  );
}
