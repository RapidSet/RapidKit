import { useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Chip, Page, useFormHandlers } from '@rapidset/rapidkit';
import { LoginForm } from './components/LoginForm';
import { loginSchema, type LoginFormValues } from './services/auth';

export function LoginPage() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const form = useFormHandlers<LoginFormValues>({
    initialValues: {
      email: 'alex@rapidset.io',
      password: '',
      remember: true,
    },
    schema: loginSchema,
    validate: (values) => ({
      email:
        values.email.includes('@') && !values.email.endsWith('@rapidset.io')
          ? 'Use your @rapidset.io work email'
          : undefined,
    }),
    onSubmit: async (values) => {
      setSubmitMessage(`Signed in as ${values.email}`);
    },
  });

  return (
    <Page
      enableSearch={false}
      className="min-h-screen w-full rounded-none bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_42%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.18)_100%)] px-6 py-8 md:px-10 md:py-12"
    >
      <div className="h-full w-full overflow-y-auto py-4">
        <div className="mx-auto flex w-full max-w-md flex-col justify-center">
          <div className="mb-6 flex flex-wrap gap-2">
            <Chip
              label="Secure Access"
              icon={ShieldCheck}
              variant="outline"
              className="border-border bg-background text-foreground"
            />
            <Chip
              label="SSO Ready"
              icon={Sparkles}
              variant="outline"
              className="border-border bg-background text-foreground"
            />
          </div>

          <LoginForm form={form} submitMessage={submitMessage} />
        </div>
      </div>
    </Page>
  );
}
