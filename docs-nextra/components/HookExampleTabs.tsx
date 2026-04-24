import { useEffect, useId, useState, type JSX } from 'react';
import { Database, FileText, PencilLine } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../../src/components/Button';
import { ButtonVariant } from '../../src/components/Button/styles';
import { Checkbox } from '../../src/components/Checkbox';
import { DetailsCard } from '../../src/components/DetailsCard';
import { Input } from '../../src/components/Input';
import { Page } from '../../src/components/Page';
import { Text } from '../../src/components/Text';
import { TextArea } from '../../src/components/TextArea';
import { useFormHandlers } from '../../src/hooks/useFormHandlers';
import { DocsCodePreview } from './DocsCodePreview';

type HookExampleId = 'use-form-handlers';
type HookExampleVariant = 'login' | 'parent-sync' | 'parent-live-sync';

type HookExampleTabsProps = Readonly<{
  hook: HookExampleId;
  example?: HookExampleVariant;
}>;

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

type ServiceDetailValues = {
  name: string;
  owner: string;
  notes: string;
};

const LOGIN_EXAMPLE_CODE = `import { useState } from 'react';
import { FileText } from 'lucide-react';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  DetailsCard,
  Input,
  Page,
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
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters.'),
  remember: z.boolean(),
});

export function LoginPagePreview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const form = useFormHandlers<LoginValues>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    schema: loginSchema,
    validate: (values) => {
      if (values.password.includes(' ')) {
        return {
          password: 'Password cannot contain spaces.',
        };
      }

      return {};
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitMessage('');

      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        setSubmitMessage(
          values.remember
            ? 'Signed in with remember me enabled.'
            : 'Signed in successfully.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Page enableSearch={false} className='max-h-none px-0 py-0'>
      <div className='mx-auto w-full max-w-2xl'>
        <DetailsCard
          title='Authentication Draft'
          icon={FileText}
          isLoading={false}
          renderCustomContent={() => (
            <form
              className='space-y-4 p-4'
              onSubmit={(event) => {
                form.handleSubmit(event);
              }}
              noValidate
            >
              <div className='space-y-1'>
                <Text as='p' weight='semibold' className='text-2xl'>
                  Welcome back
                </Text>
                <Text as='p' tone='muted'>
                  Sign in using RapidKit components and useFormHandlers.
                </Text>
              </div>

              <Input
                name='email'
                label='Email'
                value={form.values.email}
                onChange={form.handleFieldChange}
                onBlur={form.handleFieldBlurEvent}
                error={form.errors.email}
                required
              />

              <Input
                name='password'
                type='password'
                label='Password'
                value={form.values.password}
                onChange={form.handleFieldChange}
                onBlur={form.handleFieldBlurEvent}
                error={form.errors.password}
                required
              />

              <Checkbox
                name='remember'
                title='Remember me'
                checked={form.values.remember}
                onChange={form.handleFieldChange}
                onBlur={form.handleFieldBlurEvent}
              />

              <Button
                type='submit'
                label={isSubmitting ? 'Signing In...' : 'Sign In'}
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              {submitMessage ? (
                <Text as='small' tone='success'>
                  {submitMessage}
                </Text>
              ) : null}
            </form>
          )}
        />
      </div>
    </Page>
  );
}
`;

const PARENT_SYNC_EXAMPLE_CODE = `import { useMemo, useState } from 'react';
import { Database, PencilLine } from 'lucide-react';
import {
  Button,
  DetailsCard,
  Input,
  Page,
  Text,
  TextArea,
  useFormHandlers,
} from '@rapidset/rapidkit';

type ServiceDetailValues = {
  name: string;
  owner: string;
  notes: string;
};

const SOURCE_DETAIL: ServiceDetailValues = {
  name: 'Payments API',
  owner: 'Platform Team',
  notes: 'Critical service for card authorization.',
};

export function ParentDetailSyncPreview() {
  const [parentDetail, setParentDetail] = useState(SOURCE_DETAIL);

  const editor = useFormHandlers<ServiceDetailValues>({
    initialValues: parentDetail,
    validate: (values) => {
      if (!values.name.trim()) {
        return { name: 'Service name is required.' };
      }

      if (!values.owner.trim()) {
        return { owner: 'Owner is required.' };
      }

      return {};
    },
  });

  const previewSummary = useMemo(
    () => parentDetail.name + ' · ' + parentDetail.owner,
    [parentDetail],
  );

  async function applyDraft(): Promise<void> {
    const isValid = await editor.handleSubmit();
    if (!isValid) {
      return;
    }

    setParentDetail(editor.values);
  }

  function resetDraft(): void {
    editor.resetForm(parentDetail);
  }

  return (
    <Page enableSearch={false} className='max-h-none px-0 py-0'>
      <div className='grid gap-4 md:grid-cols-2'>
        <DetailsCard
          title='Source-of-Truth State'
          icon={Database}
          isLoading={false}
          renderCustomContent={() => (
            <div className='space-y-2 p-4'>
              <Text as='p' tone='muted'>
                This panel represents external source-of-truth data.
              </Text>
              <Text as='p'>{previewSummary}</Text>
              <Text as='small' tone='muted'>
                {parentDetail.notes}
              </Text>
            </div>
          )}
        />

        <DetailsCard
          title='Detail State Editor'
          icon={PencilLine}
          isLoading={false}
          renderCustomContent={() => (
            <div className='space-y-3 p-4'>
              <Text as='p' tone='muted'>
                Uses shared handlers; commits validated draft to source-of-truth on Apply.
              </Text>

              <Input
                name='name'
                label='Service Name'
                value={editor.values.name}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
                error={editor.errors.name}
              />

              <Input
                name='owner'
                label='Owner'
                value={editor.values.owner}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
                error={editor.errors.owner}
              />

              <TextArea
                name='notes'
                label='Notes'
                value={editor.values.notes}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />

              <div className='flex gap-2'>
                <Button
                  label='Commit Draft'
                  onClick={() => {
                    applyDraft();
                  }}
                />
                <Button
                  label='Reset Draft'
                  variant='outlined'
                  onClick={resetDraft}
                />
              </div>
            </div>
          )}
        />
      </div>
    </Page>
  );
}
`;

const PARENT_LIVE_SYNC_EXAMPLE_CODE = `import { useEffect, useState } from 'react';
import { Database, PencilLine } from 'lucide-react';
import {
  DetailsCard,
  Input,
  Page,
  Text,
  TextArea,
  useFormHandlers,
} from '@rapidset/rapidkit';

type ServiceDetailValues = {
  name: string;
  owner: string;
  notes: string;
};

const SOURCE_DETAIL: ServiceDetailValues = {
  name: 'Identity Gateway',
  owner: 'Security Team',
    <Page enableSearch={false} className='max-h-none px-0 py-0'>
      <div className='grid gap-4 md:grid-cols-2'>
        <DetailsCard
          title='Source-of-Truth State (Live)'
          icon={Database}
          isLoading={false}
          renderCustomContent={() => (
            <div className='space-y-2 p-4'>
              <Text as='p' tone='muted'>
                Updates immediately on each change.
              </Text>
              <Text as='p'>
                {parentDetail.name} - {parentDetail.owner}
              </Text>
              <Text as='small' tone='muted'>
                {parentDetail.notes}
              </Text>
            </div>
          )}
        />

        <DetailsCard
          title='Detail State Editor'
          icon={PencilLine}
          isLoading={false}
          renderCustomContent={() => (
            <div className='space-y-3 p-4'>
              <Text as='p' tone='muted'>
                Uses shared handlers only.
              </Text>

              <Input
                name='name'
                label='Service Name'
                value={editor.values.name}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />

              <Input
                name='owner'
                label='Owner'
                value={editor.values.owner}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />

              <TextArea
                name='notes'
                label='Notes'
                value={editor.values.notes}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />
            </div>
          )}
        />
      </div>
    </Page>
            value={editor.values.owner}
            onChange={editor.handleFieldChange}
            onBlur={editor.handleFieldBlurEvent}
          />

          <TextArea
            name='notes'
            label='Notes'
            value={editor.values.notes}
            onChange={editor.handleFieldChange}
            onBlur={editor.handleFieldBlurEvent}
          />
        </div>
      </section>
    </div>
  );
}
`;

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
  remember: z.boolean(),
});

function UseFormHandlersPreview(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const form = useFormHandlers<LoginValues>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    schema: loginSchema,
    validate: (values) => {
      if (values.password.includes(' ')) {
        return {
          password: 'Password cannot contain spaces.',
        };
      }

      return {};
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitMessage('');

      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        setSubmitMessage(
          values.remember
            ? 'Signed in with remember me enabled.'
            : 'Signed in successfully.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Page enableSearch={false} className="max-h-none px-0 py-0">
      <div className="mx-auto w-full max-w-2xl">
        <DetailsCard
          title="Authentication Draft"
          icon={FileText}
          isLoading={false}
          renderCustomContent={() => (
            <form
              className="space-y-4 p-4"
              onSubmit={(event) => {
                form.handleSubmit(event);
              }}
              noValidate
            >
              <div className="space-y-1">
                <Text as="p" weight="semibold" className="text-2xl">
                  Welcome back
                </Text>
                <Text as="p" tone="muted">
                  Sign in using RapidKit components and useFormHandlers.
                </Text>
              </div>

              <Input
                name="email"
                label="Email"
                value={form.values.email}
                onChange={form.handleFieldChange}
                onBlur={form.handleFieldBlurEvent}
                error={form.errors.email}
                required
              />

              <Input
                name="password"
                type="password"
                label="Password"
                value={form.values.password}
                onChange={form.handleFieldChange}
                onBlur={form.handleFieldBlurEvent}
                error={form.errors.password}
                required
              />

              <Checkbox
                name="remember"
                title="Remember me"
                checked={form.values.remember}
                onChange={form.handleFieldChange}
                onBlur={form.handleFieldBlurEvent}
              />

              <Button
                type="submit"
                label={isSubmitting ? 'Signing In...' : 'Sign In'}
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              {submitMessage ? (
                <Text as="small" tone="success">
                  {submitMessage}
                </Text>
              ) : null}
            </form>
          )}
        />
      </div>
    </Page>
  );
}

const SOURCE_DETAIL: ServiceDetailValues = {
  name: 'Payments API',
  owner: 'Platform Team',
  notes: 'Critical service for card authorization.',
};

function ParentDetailSyncPreview(): JSX.Element {
  const [parentDetail, setParentDetail] = useState(SOURCE_DETAIL);

  const editor = useFormHandlers<ServiceDetailValues>({
    initialValues: parentDetail,
    validate: (values) => {
      if (!values.name.trim()) {
        return { name: 'Service name is required.' };
      }

      if (!values.owner.trim()) {
        return { owner: 'Owner is required.' };
      }

      return {};
    },
  });

  async function applyDraft(): Promise<void> {
    const isValid = await editor.handleSubmit();
    if (!isValid) {
      return;
    }

    setParentDetail(editor.values);
  }

  function resetDraft(): void {
    editor.resetForm(parentDetail);
  }

  return (
    <Page enableSearch={false} className="max-h-none px-0 py-0">
      <div className="grid gap-4 md:grid-cols-2">
        <DetailsCard
          title="Source-of-Truth State"
          icon={Database}
          isLoading={false}
          renderCustomContent={() => (
            <div className="space-y-2 p-4">
              <Text as="p" tone="muted">
                This panel represents external source-of-truth data.
              </Text>
              <Text as="p">
                {parentDetail.name} - {parentDetail.owner}
              </Text>
              <Text as="small" tone="muted">
                {parentDetail.notes}
              </Text>
            </div>
          )}
        />

        <DetailsCard
          title="Detail State Editor"
          icon={PencilLine}
          isLoading={false}
          renderCustomContent={() => (
            <div className="space-y-3 p-4">
              <Text as="p" tone="muted">
                Uses shared handlers; commits validated draft to source-of-truth
                on Apply.
              </Text>

              <Input
                name="name"
                label="Service Name"
                value={editor.values.name}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
                error={editor.errors.name}
              />

              <Input
                name="owner"
                label="Owner"
                value={editor.values.owner}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
                error={editor.errors.owner}
              />

              <TextArea
                name="notes"
                label="Notes"
                value={editor.values.notes}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />

              <div className="flex gap-2">
                <Button
                  label="Commit Draft"
                  onClick={() => {
                    applyDraft();
                  }}
                />
                <Button
                  label="Reset Draft"
                  variant={ButtonVariant.Outlined}
                  onClick={resetDraft}
                />
              </div>
            </div>
          )}
        />
      </div>
    </Page>
  );
}

function ParentLiveSyncPreview(): JSX.Element {
  const [parentDetail, setParentDetail] = useState({
    name: 'Identity Gateway',
    owner: 'Security Team',
    notes: 'Issues OIDC tokens and validates sessions.',
  });

  const editor = useFormHandlers<ServiceDetailValues>({
    initialValues: parentDetail,
  });

  useEffect(() => {
    setParentDetail(editor.values);
  }, [editor.values]);

  return (
    <Page enableSearch={false} className="max-h-none px-0 py-0">
      <div className="grid gap-4 md:grid-cols-2">
        <DetailsCard
          title="Source-of-Truth State (Live)"
          icon={Database}
          isLoading={false}
          renderCustomContent={() => (
            <div className="space-y-2 p-4">
              <Text as="p" tone="muted">
                Updates immediately on each change.
              </Text>
              <Text as="p">
                {parentDetail.name} - {parentDetail.owner}
              </Text>
              <Text as="small" tone="muted">
                {parentDetail.notes}
              </Text>
            </div>
          )}
        />

        <DetailsCard
          title="Detail State Editor"
          icon={PencilLine}
          isLoading={false}
          renderCustomContent={() => (
            <div className="space-y-3 p-4">
              <Text as="p" tone="muted">
                Uses shared handlers only.
              </Text>

              <Input
                name="name"
                label="Service Name"
                value={editor.values.name}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />

              <Input
                name="owner"
                label="Owner"
                value={editor.values.owner}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />

              <TextArea
                name="notes"
                label="Notes"
                value={editor.values.notes}
                onChange={editor.handleFieldChange}
                onBlur={editor.handleFieldBlurEvent}
              />
            </div>
          )}
        />
      </div>
    </Page>
  );
}

const HOOK_EXAMPLES: Record<
  `${HookExampleId}:${HookExampleVariant}`,
  { code: string; render: () => JSX.Element }
> = {
  'use-form-handlers:login': {
    code: LOGIN_EXAMPLE_CODE,
    render: UseFormHandlersPreview,
  },
  'use-form-handlers:parent-sync': {
    code: PARENT_SYNC_EXAMPLE_CODE,
    render: ParentDetailSyncPreview,
  },
  'use-form-handlers:parent-live-sync': {
    code: PARENT_LIVE_SYNC_EXAMPLE_CODE,
    render: ParentLiveSyncPreview,
  },
};

export function HookExampleTabs({
  hook,
  example = 'login',
}: HookExampleTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const idPrefix = useId();
  const previewTabId = `${idPrefix}-preview-tab`;
  const codeTabId = `${idPrefix}-code-tab`;
  const previewPanelId = `${idPrefix}-preview-panel`;
  const codePanelId = `${idPrefix}-code-panel`;

  const resolvedExample = HOOK_EXAMPLES[`${hook}:${example}`];
  const Preview = resolvedExample.render;

  return (
    <div className="component-example-tabs">
      <div
        className="component-example-tabs__controls"
        role="tablist"
        aria-label="Example tabs"
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
