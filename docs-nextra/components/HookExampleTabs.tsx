import { useEffect, useId, useState, type JSX } from 'react';
import { Database, FileText, PencilLine } from 'lucide-react';
import {
  ApiProvider,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { z } from 'zod';
import { Button } from '../../src/components/Button';
import { ButtonVariant } from '../../src/components/Button/styles';
import { BaseTable } from '../../src/components/BaseTable';
import type { Column } from '../../src/components/BaseTable/components/BaseTableRow';
import { CellType } from '../../src/components/BaseTable/components/BaseTableRow/components/BaseTableCell';
import { Checkbox } from '../../src/components/Checkbox';
import { DetailsCard } from '../../src/components/DetailsCard';
import { Input } from '../../src/components/Input';
import { Page } from '../../src/components/Page';
import { Text } from '../../src/components/Text';
import { TextArea } from '../../src/components/TextArea';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useFormHandlers } from '../../src/hooks/useFormHandlers';
import { useSearchPagination } from '../../src/hooks/useSearchPagination';
import {
  DEFAULT_PAGINATED_RESPONSE,
  DEFAULT_PAGINATION_PARAMS,
  type PaginationParams,
  type PaginatedResponse,
} from '../../src/lib/pagination';
import { DocsCodePreview } from './DocsCodePreview';

type HookExampleId =
  | 'use-form-handlers'
  | 'use-debounce'
  | 'use-search-pagination';
type HookExampleVariant =
  | 'default'
  | 'login'
  | 'parent-sync'
  | 'parent-live-sync';

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

type SearchUserRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  status: string;
  role: string;
};

type RemoteUsersResponse = {
  users: RemoteUserRecord[];
};

type RemoteUserRecord = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  age: number;
  company: {
    title: string;
  };
};

const STATUS_TONE_CLASS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-rose-100 text-rose-700',
};

const getStatusToneKey = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return `${value}`;
  }

  return '';
};

const resolvePreviewStatus = (age: number): string => {
  if (age < 30) {
    return 'active';
  }

  if (age < 50) {
    return 'pending';
  }

  return 'suspended';
};

const SEARCH_USER_COLUMNS: Column<SearchUserRow>[] = [
  {
    id: 'avatar',
    header: 'Avatar',
    accessorKey: 'name',
    type: CellType.AVATAR,
  },
  {
    id: 'photo',
    header: 'Photo',
    accessorKey: 'avatar',
    type: CellType.IMAGE,
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    type: CellType.TEXT,
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    type: CellType.TEXT,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    type: CellType.CHIP,
    styler: (value) => STATUS_TONE_CLASS[getStatusToneKey(value)] ?? '',
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    type: CellType.TEXT,
    sortable: true,
  },
];

const DEFAULT_SEARCH_USER_PAGINATED_RESPONSE: PaginatedResponse<SearchUserRow> =
  DEFAULT_PAGINATED_RESPONSE as PaginatedResponse<SearchUserRow>;

const previewUsersApi = createApi({
  reducerPath: 'previewUsersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<SearchUserRow>, PaginationParams>(
      {
        query: () => '/users?limit=10',
        transformResponse: (response: RemoteUsersResponse, _meta, params) => {
          const page = params.page ?? DEFAULT_PAGINATION_PARAMS.page ?? 1;
          const size = params.size ?? DEFAULT_PAGINATION_PARAMS.size ?? 20;
          const query = (params.query ?? '').toLowerCase().trim();

          const users: SearchUserRow[] = response.users.map((item) => ({
            id: item.id,
            avatar: item.image,
            name: `${item.firstName} ${item.lastName}`,
            email: item.email,
            status: resolvePreviewStatus(item.age),
            role: item.company.title,
          }));

          const filteredUsers = query
            ? users.filter(
                (item) =>
                  item.status.toLowerCase().includes(query) ||
                  item.name.toLowerCase().includes(query) ||
                  item.email.toLowerCase().includes(query) ||
                  item.role.toLowerCase().includes(query),
              )
            : users;

          const start = (page - 1) * size;

          return {
            items: filteredUsers.slice(start, start + size),
            totalItems: filteredUsers.length,
            currentPage: page,
            totalPages: Math.max(1, Math.ceil(filteredUsers.length / size)),
            itemsPerPage: size,
          };
        },
      },
    ),
  }),
});

const { useGetUsersQuery } = previewUsersApi;

const USE_DEBOUNCE_EXAMPLE_CODE = `import { useEffect, useState } from 'react';
import { Input, Page, Text, useDebounce } from '@rapidset/rapidkit';

export function DebouncePreview() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    console.log('Run search with:', debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Page enableSearch={false} className='max-h-none px-0 py-0'>
      <div className='space-y-3 rounded-xl border border-border bg-card p-4'>
        <Input
          name='query'
          label='Search Query'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder='Type to debounce...'
        />

        <Text as='small' tone='muted'>
          Immediate: {query || '(empty)'}
        </Text>
        <Text as='small' tone='muted'>
          Debounced: {debouncedQuery || '(empty)'}
        </Text>
      </div>
    </Page>
  );
}
`;

const USE_SEARCH_PAGINATION_EXAMPLE_CODE = `
import {
  ApiProvider,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  BaseTable,
  DEFAULT_PAGINATED_RESPONSE,
  DEFAULT_PAGINATION_PARAMS,
  Page,
  type PaginatedResponse,
  type PaginationParams,
  useSearchPagination,
} from '@rapidset/rapidkit';

type UserRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  status: string;
  role: string;
};

type RemoteUsersResponse = {
  users: RemoteUserRecord[];
};

type RemoteUserRecord = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  age: number;
  company: {
    title: string;
  };
};

const STATUS_TONE_CLASS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-rose-100 text-rose-700',
};

const resolveStatus = (age: number) => {
  if (age < 30) {
    return 'active';
  }
  if (age < 50) {
    return 'pending';
  }
  return 'suspended';
};

const COLUMNS = [
  { id: 'avatar', header: 'Avatar', accessorKey: 'name', type: 'avatar' },
  { id: 'photo', header: 'Photo', accessorKey: 'avatar', type: 'image' },
  { id: 'name', header: 'Name', accessorKey: 'name', type: 'text', sortable: true },
  { id: 'email', header: 'Email', accessorKey: 'email', type: 'text' },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    type: 'chip',
    styler: (value) => STATUS_TONE_CLASS[String(value)] ?? '',
  },
  { id: 'role', header: 'Role', accessorKey: 'role', type: 'text' },
];

const DEFAULT_USER_PAGINATED_RESPONSE =
  DEFAULT_PAGINATED_RESPONSE as PaginatedResponse<UserRow>;

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<UserRow>, PaginationParams>({
      query: () => '/users?limit=10',
      transformResponse: (response: RemoteUsersResponse, _meta, params) => {
        const page = params.page ?? 1;
        const size = params.size ?? 20;
        const query = (params.query ?? '').toLowerCase().trim();

        const users: UserRow[] = response.users.map((item) => ({
          id: item.id,
          avatar: item.image,
          name: item.firstName + ' ' + item.lastName,
          email: item.email,
          status: resolveStatus(item.age),
          role: item.company.title,
        }));

        const filteredUsers = query
          ? users.filter(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.role.toLowerCase().includes(query) ||
                item.status.toLowerCase().includes(query),
            )
          : users;

        const start = (page - 1) * size;

        return {
          items: filteredUsers.slice(start, start + size),
          totalItems: filteredUsers.length,
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(filteredUsers.length / size)),
          itemsPerPage: size,
        };
      },
    }),
  }),
});

const { useGetUsersQuery } = usersApi;

export function SearchPaginationPreview() {
  return (
    <ApiProvider api={usersApi}>
      <SearchPaginationPreviewContent />
    </ApiProvider>
  );
}

function SearchPaginationPreviewContent() {
  const { paginationParams, handleSearch, handlePaginationChange } =
    useSearchPagination({ ...DEFAULT_PAGINATION_PARAMS, size: 5 });

  const { data = DEFAULT_USER_PAGINATED_RESPONSE, isFetching, error } =
    useGetUsersQuery({
      ...paginationParams,
      query: paginationParams.query || undefined,
    });

  const tableQueryParams = {
    query: paginationParams.query ?? '',
    page: paginationParams.page ?? 1,
    size: paginationParams.size ?? 5,
  };

  const handleTableQueryParamsChange = (next) => {
    handlePaginationChange({
      ...paginationParams,
      page: next.page,
      size: next.size,
      query: next.query || undefined,
    });
  };

  const tablePlaceholder = error
    ? 'Unable to load users from the users endpoint.'
    : 'No users found.';

  return (
    <Page
      onSearch={handleSearch}
      searchPlaceholder='Search users'
      className='h-full min-h-[28rem] w-full max-h-none px-0 py-0'
    >
      <BaseTable
        data={data.items}
        columns={COLUMNS}
        isLoading={isFetching}
        totalItems={data.totalItems}
        totalPages={data.totalPages}
        placeholder={tablePlaceholder}
        queryParams={tableQueryParams}
        onQueryParamsChange={handleTableQueryParamsChange}
      />
    </Page>
  );
}
`;

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

function UseDebouncePreview(): JSX.Element {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <Page enableSearch={false} className="max-h-none px-0 py-0">
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <Input
          name="query"
          label="Search Query"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Type to debounce..."
        />

        <Text as="small" tone="muted">
          Immediate: {query || '(empty)'}
        </Text>
        <Text as="small" tone="muted">
          Debounced: {debouncedQuery || '(empty)'}
        </Text>
      </div>
    </Page>
  );
}

function UseSearchPaginationPreviewContent(): JSX.Element {
  const { paginationParams, handleSearch, handlePaginationChange } =
    useSearchPagination({ ...DEFAULT_PAGINATION_PARAMS, size: 5 });
  const {
    data = DEFAULT_SEARCH_USER_PAGINATED_RESPONSE,
    isFetching,
    error,
  } = useGetUsersQuery({
    ...paginationParams,
    query: paginationParams.query || undefined,
  });

  const tableQueryParams = {
    query: paginationParams.query ?? '',
    page: paginationParams.page ?? 1,
    size: paginationParams.size ?? 5,
  };

  const handleTableQueryParamsChange = (next: {
    query: string;
    page: number;
    size: number;
  }) => {
    handlePaginationChange({
      ...paginationParams,
      page: next.page,
      size: next.size,
      query: next.query || undefined,
    });
  };

  const tablePlaceholder = error
    ? 'Unable to load users from the users endpoint.'
    : 'No users found.';

  return (
    <Page
      onSearch={handleSearch}
      searchPlaceholder="Search users"
      className="h-full min-h-[28rem] w-full max-h-none px-0 py-0"
    >
      <BaseTable<SearchUserRow>
        data={data.items}
        columns={SEARCH_USER_COLUMNS}
        isLoading={isFetching}
        totalItems={data.totalItems}
        totalPages={data.totalPages}
        placeholder={tablePlaceholder}
        queryParams={tableQueryParams}
        onQueryParamsChange={handleTableQueryParamsChange}
      />
    </Page>
  );
}

function UseSearchPaginationPreview(): JSX.Element {
  return (
    <ApiProvider api={previewUsersApi}>
      <UseSearchPaginationPreviewContent />
    </ApiProvider>
  );
}

const HOOK_EXAMPLES: Partial<
  Record<
    `${HookExampleId}:${HookExampleVariant}`,
    { code: string; render: () => JSX.Element }
  >
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
  'use-debounce:default': {
    code: USE_DEBOUNCE_EXAMPLE_CODE,
    render: UseDebouncePreview,
  },
  'use-search-pagination:default': {
    code: USE_SEARCH_PAGINATION_EXAMPLE_CODE,
    render: UseSearchPaginationPreview,
  },
};

export function HookExampleTabs({
  hook,
  example,
}: HookExampleTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const idPrefix = useId();
  const previewTabId = `${idPrefix}-preview-tab`;
  const codeTabId = `${idPrefix}-code-tab`;
  const previewPanelId = `${idPrefix}-preview-panel`;
  const codePanelId = `${idPrefix}-code-panel`;

  const defaultExampleByHook: Record<HookExampleId, HookExampleVariant> = {
    'use-form-handlers': 'login',
    'use-debounce': 'default',
    'use-search-pagination': 'default',
  };

  const resolvedKey =
    `${hook}:${example ?? defaultExampleByHook[hook]}` as const;
  const resolvedExample = HOOK_EXAMPLES[resolvedKey];

  if (!resolvedExample) {
    throw new Error(`Missing hook example configuration for: ${resolvedKey}`);
  }

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
