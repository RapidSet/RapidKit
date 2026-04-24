import { useId, useState, type JSX } from 'react';
import { ArrowRight, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { Button, ButtonVariant } from '../../src/components/Button';
import { Checkbox } from '../../src/components/Checkbox';
import { Chip } from '../../src/components/Chip';
import { Input } from '../../src/components/Input';
import { Page } from '../../src/components/Page';
import { Text } from '../../src/components/Text';
import { useFormHandlers } from '../../src/hooks/useFormHandlers';
import { DocsCodePreview } from './DocsCodePreview';

export type FlowExampleId = 'login';

type FlowTab = 'preview' | 'code';

type FlowExampleTabsProps = Readonly<{
  flow: FlowExampleId;
  initialTab?: FlowTab;
  fullPreviewHref?: string;
}>;

type FlowExample = Readonly<{
  code: string;
  render: () => JSX.Element;
}>;

const LOGIN_FLOW_EXAMPLE_CODE = `import { useState } from 'react';
import {
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { z } from 'zod';
import {
  Button,
  ButtonVariant,
  Checkbox,
  Chip,
  Input,
  Page,
  Text,
  useFormHandlers,
} from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const loginSchema = z.object({
  email: z.string().email('Enter a valid work email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  remember: z.boolean(),
});

const LOGIN_PROVIDERS = ['Continue with Google', 'Continue with Microsoft'] as const;
export function LoginFlowPreview() {
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
      setSubmitMessage('Signed in as ' + values.email);
    },
  });

  return (
    <Page
      enableSearch={false}
      className='min-h-[42rem] w-full rounded-none bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_42%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.18)_100%)] px-6 py-12 md:px-10 md:py-16'
    >
      <div className='h-full w-full overflow-y-auto py-4'>
        <div className='mx-auto flex w-full max-w-md flex-col justify-center'>
          <div className='mb-6 flex flex-wrap gap-2'>
          <Chip label='Secure Access' icon={ShieldCheck} variant='outline' className='border-border bg-background text-foreground' />
          <Chip label='SSO Ready' icon={Sparkles} variant='outline' className='border-border bg-background text-foreground' />
          </div>

          <form
            className='rounded-xl border border-border bg-card p-6 shadow-sm'
            onSubmit={(event) => {
              void form.handleSubmit(event);
            }}
          >
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background'>
              <KeyRound className='h-5 w-5 text-foreground' aria-hidden='true' />
            </div>
            <div>
              <Text as='p' className='text-lg font-semibold text-foreground'>
                Welcome back
              </Text>
              <Text as='p' tone='muted' className='text-sm'>
                Sign in to continue into your workspace.
              </Text>
            </div>
          </div>

            <div className='mt-6 space-y-3'>
              {LOGIN_PROVIDERS.map((provider) => (
                <Button
                  key={provider}
                  type='button'
                  variant={ButtonVariant.Outlined}
                  label={provider}
                  className='w-full justify-center'
                />
              ))}
            </div>

            <div className='my-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-border' />
              <Text as='p' tone='muted' className='text-xs uppercase tracking-[0.18em]'>
                Or use password
              </Text>
              <div className='h-px flex-1 bg-border' />
            </div>

            <div className='space-y-4'>
              <Input
                {...form.getTextFieldProps('email')}
                type='email'
                label='Work Email'
                placeholder='name@company.com'
              />
              <Input
                {...form.getTextFieldProps('password')}
                type='password'
                label='Password'
                placeholder='Enter your password'
              />
            </div>

            <div className='mt-4 flex items-center justify-between gap-3'>
              <Checkbox {...form.getCheckboxFieldProps('remember')} title='Remember me' />
              <button type='button' className='text-sm font-medium text-primary'>
                Forgot password?
              </button>
            </div>

            <div className='mt-6 space-y-3'>
              <Button
                type='submit'
                variant={ButtonVariant.Primary}
                rightIcon={ArrowRight}
                label='Sign In'
                className='w-full justify-center'
              />
              {submitMessage ? (
                <Text as='p' tone='success' className='text-center text-sm'>
                  {submitMessage}
                </Text>
              ) : null}
              <Text as='p' tone='muted' className='text-center text-sm'>
                Need an account? Request an invitation from your workspace admin.
              </Text>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}
`;

const LOGIN_PROVIDERS = [
  'Continue with Google',
  'Continue with Microsoft',
] as const;

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const loginSchema = z.object({
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  remember: z.boolean(),
});

function LoginFlowPreview(): JSX.Element {
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
      className="min-h-[42rem] w-full rounded-none bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_42%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.18)_100%)] px-6 py-12 md:px-10 md:py-16"
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

          <form
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
            onSubmit={(event) => {
              void form.handleSubmit(event);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
                <KeyRound
                  className="h-5 w-5 text-foreground"
                  aria-hidden="true"
                />
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
              <button
                type="button"
                className="text-sm font-medium text-primary"
              >
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
                Need an account? Request an invitation from your workspace
                admin.
              </Text>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}

const FLOW_EXAMPLES: Record<FlowExampleId, FlowExample> = {
  login: {
    code: LOGIN_FLOW_EXAMPLE_CODE,
    render: LoginFlowPreview,
  },
};

export function FlowPreviewSurface({
  flow,
}: Readonly<{ flow: FlowExampleId }>): JSX.Element {
  const Preview = FLOW_EXAMPLES[flow].render;

  return <Preview />;
}

function resolveInitialFlowTab(initialTab?: FlowTab): FlowTab {
  if (initialTab) {
    return initialTab;
  }

  if (globalThis.window === undefined) {
    return 'preview';
  }

  const tab = new URLSearchParams(globalThis.window.location.search).get('tab');
  return tab === 'code' ? 'code' : 'preview';
}

export function FlowExampleTabs({
  flow,
  initialTab,
  fullPreviewHref,
}: FlowExampleTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<FlowTab>(() =>
    resolveInitialFlowTab(initialTab),
  );
  const idPrefix = useId();
  const previewTabId = `${idPrefix}-preview-tab`;
  const codeTabId = `${idPrefix}-code-tab`;
  const previewPanelId = `${idPrefix}-preview-panel`;
  const codePanelId = `${idPrefix}-code-panel`;
  const resolvedExample = FLOW_EXAMPLES[flow];

  const Preview = resolvedExample.render;

  return (
    <div className="component-example-tabs">
      <div className="component-example-tabs__controls">
        <div
          role="tablist"
          aria-label="Flow example tabs"
          className="flex items-center gap-1"
        >
          <button
            id={previewTabId}
            type="button"
            role="tab"
            aria-controls={previewPanelId}
            aria-selected={activeTab === 'preview'}
            className={`component-example-tabs__button ${
              activeTab === 'preview' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            id={codeTabId}
            type="button"
            role="tab"
            aria-controls={codePanelId}
            aria-selected={activeTab === 'code'}
            className={`component-example-tabs__button ${
              activeTab === 'code' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        </div>

        {fullPreviewHref ? (
          <a
            href={fullPreviewHref}
            target="_blank"
            rel="noreferrer"
            className="component-example-tabs__button no-underline"
          >
            Full
          </a>
        ) : null}
      </div>

      <div
        id={previewPanelId}
        role="tabpanel"
        aria-labelledby={previewTabId}
        hidden={activeTab !== 'preview'}
        className="component-example-tabs__panel"
      >
        {activeTab === 'preview' ? (
          <div className="component-example-tabs__preview">
            <Preview />
          </div>
        ) : null}
      </div>

      <div
        id={codePanelId}
        role="tabpanel"
        aria-labelledby={codeTabId}
        hidden={activeTab !== 'code'}
        className="component-example-tabs__panel"
      >
        {activeTab === 'code' ? (
          <DocsCodePreview code={resolvedExample.code} language="tsx" />
        ) : null}
      </div>
    </div>
  );
}
