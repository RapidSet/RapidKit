import { useEffect, useId, useMemo, useState, type JSX } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FolderOpen,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Mail,
  MousePointerClick,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { z } from 'zod';
import { Avatar } from '../../src/components/Avatar';
import { BaseTable } from '../../src/components/BaseTable';
import {
  CellType,
  type Column,
} from '../../src/components/BaseTable/components/BaseTableRow/types';
import { Button, ButtonVariant } from '../../src/components/Button';
import { Chart } from '../../src/components/Chart';
import { ChartVariant } from '../../src/components/Chart/consts';
import type { ChartConfig } from '../../src/components/Chart/types';
import { Checkbox } from '../../src/components/Checkbox';
import { Chip } from '../../src/components/Chip';
import { DropDown } from '../../src/components/DropDown';
import { Image } from '../../src/components/Image';
import { Input } from '../../src/components/Input';
import { Page } from '../../src/components/Page';
import { Search } from '../../src/components/Search';
import { SideBar, SideBarTrigger } from '../../src/components/SideBar';
import { SideBarBrand } from '../../src/components/SideBar/components/SideBarBrand';
import type { SideBarMenuItem } from '../../src/components/SideBar/types';
import { StatCard } from '../../src/components/StatCard';
import type { StatCardTrend } from '../../src/components/StatCard/types';
import { Text } from '../../src/components/Text';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useFormHandlers } from '../../src/hooks/useFormHandlers';
import { useSearchPagination } from '../../src/hooks/useSearchPagination';
import { DocsCodePreview } from './DocsCodePreview';
import { FlowPreviewFrame } from './FlowPreviewFrame';

export type FlowExampleId = 'dashboard' | 'login';

type FlowTab = 'preview' | 'code';

type FlowExampleTabsProps = Readonly<{
  flow: FlowExampleId;
  initialTab?: FlowTab;
  previewSrc: string;
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

const DASHBOARD_FLOW_EXAMPLE_CODE = `import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FolderOpen,
  Globe2,
  LayoutDashboard,
  LineChart,
  Mail,
  MousePointerClick,
  Plus,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import {
  Avatar,
  BaseTable,
  Button,
  ButtonVariant,
  CellType,
  Chart,
  ChartVariant,
  Chip,
  DropDown,
  Image,
  Page,
  Search,
  SideBar,
  SideBarBrand,
  SideBarTrigger,
  StatCard,
  Text,
  useDebounce,
  useSearchPagination,
  type ChartConfig,
  type Column,
  type SideBarMenuItem,
  type StatCardTrend,
} from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

type DashboardActivity = {
  id: string;
  actor: string;
  avatarUrl: string;
  action: string;
  channel: 'Sales' | 'Marketing' | 'Engineering' | 'Product';
  region: 'NA' | 'EMEA' | 'APAC';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  status: 'completed' | 'pending' | 'in_review';
  timestamp: string;
};

type DashboardKpi = {
  key: string;
  label: string;
  value: string;
  delta: string;
  trend: StatCardTrend;
  icon: typeof Users;
};

type DashboardGoal = {
  key: string;
  label: string;
  current: number;
  target: number;
  unit: string;
};

type DashboardPerformer = {
  id: string;
  name: string;
  role: string;
  score: string;
  trend: StatCardTrend;
  avatarUrl: string;
};

type DashboardMediaAsset = {
  id: string;
  src: string;
  caption: string;
};

type DashboardNavItem = {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
  items?: ReadonlyArray<{ key: string; label: string }>;
};

const DASHBOARD_NAV: ReadonlyArray<DashboardNavItem> = [
  {
    key: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    group: 'Workspace',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    group: 'Workspace',
    items: [
      { key: 'analytics.acquisition', label: 'Acquisition' },
      { key: 'analytics.engagement', label: 'Engagement' },
      { key: 'analytics.retention', label: 'Retention' },
    ],
  },
  { key: 'audiences', label: 'Audiences', icon: Users, group: 'Audience' },
  {
    key: 'campaigns',
    label: 'Campaigns',
    icon: Target,
    group: 'Audience',
    items: [
      { key: 'campaigns.active', label: 'Active' },
      { key: 'campaigns.drafts', label: 'Drafts' },
      { key: 'campaigns.archive', label: 'Archive' },
    ],
  },
  { key: 'alerts', label: 'Alerts', icon: Bell, group: 'System' },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    group: 'System',
    items: [
      { key: 'settings.profile', label: 'Profile' },
      { key: 'settings.team', label: 'Team' },
      { key: 'settings.billing', label: 'Billing' },
    ],
  },
];

const DASHBOARD_MEDIA: DashboardMediaAsset[] = [
  { id: 'media-1', src: 'https://picsum.photos/seed/rapidkit-1/400/300', caption: 'Q3 launch teaser' },
  { id: 'media-2', src: 'https://picsum.photos/seed/rapidkit-2/400/300', caption: 'Brand refresh' },
  { id: 'media-3', src: 'https://picsum.photos/seed/rapidkit-3/400/300', caption: 'Pricing hero' },
  { id: 'media-4', src: 'https://picsum.photos/seed/rapidkit-4/400/300', caption: 'Onboarding cover' },
  { id: 'media-5', src: 'https://picsum.photos/seed/rapidkit-5/400/300', caption: 'Webinar slide' },
  { id: 'media-6', src: 'https://picsum.photos/seed/rapidkit-6/400/300', caption: 'Help center icon' },
];

const DASHBOARD_KPIS: DashboardKpi[] = [
  { key: 'users', label: 'Active users', value: '24,318', delta: '+12.4%', trend: 'up', icon: Users },
  { key: 'revenue', label: 'Revenue', value: '$84,210', delta: '+8.1%', trend: 'up', icon: DollarSign },
  { key: 'conversion', label: 'Conversion rate', value: '3.42%', delta: '-0.6%', trend: 'down', icon: TrendingUp },
  { key: 'sessions', label: 'Sessions', value: '109,884', delta: '+4.7%', trend: 'up', icon: Activity },
];

const DASHBOARD_SESSIONS_7D = [
  { day: 'Mon', sessions: 12400, signups: 480 },
  { day: 'Tue', sessions: 13280, signups: 512 },
  { day: 'Wed', sessions: 14820, signups: 575 },
  { day: 'Thu', sessions: 15960, signups: 612 },
  { day: 'Fri', sessions: 17120, signups: 698 },
  { day: 'Sat', sessions: 13740, signups: 540 },
  { day: 'Sun', sessions: 12290, signups: 470 },
];

const DASHBOARD_SESSIONS_30D = [
  { day: 'W1', sessions: 84200, signups: 3120 },
  { day: 'W2', sessions: 91440, signups: 3478 },
  { day: 'W3', sessions: 98820, signups: 3712 },
  { day: 'W4', sessions: 102310, signups: 3940 },
];

const DASHBOARD_SESSIONS_CONFIG: ChartConfig = {
  sessions: { label: 'Sessions' },
  signups: { label: 'Sign-ups' },
};

const DASHBOARD_TRAFFIC_SOURCES = [
  { source: 'Organic', visits: 4280 },
  { source: 'Referral', visits: 2190 },
  { source: 'Paid', visits: 1840 },
  { source: 'Email', visits: 1320 },
  { source: 'Social', visits: 980 },
];

const DASHBOARD_TRAFFIC_CONFIG: ChartConfig = {
  Organic: { label: 'Organic' },
  Referral: { label: 'Referral' },
  Paid: { label: 'Paid' },
  Email: { label: 'Email' },
  Social: { label: 'Social' },
};

const DASHBOARD_CHANNELS = [
  { channel: 'Search', conversions: 1240 },
  { channel: 'Social', conversions: 980 },
  { channel: 'Email', conversions: 780 },
  { channel: 'Direct', conversions: 540 },
  { channel: 'Partners', conversions: 320 },
];

const DASHBOARD_CHANNELS_CONFIG: ChartConfig = {
  conversions: { label: 'Conversions' },
};

const DASHBOARD_GOALS: DashboardGoal[] = [
  { key: 'mrr', label: 'Monthly recurring revenue', current: 68000, target: 80000, unit: '$' },
  { key: 'qsignups', label: 'Quarterly sign-ups', current: 5420, target: 7500, unit: '' },
  { key: 'csat', label: 'CSAT score', current: 84, target: 90, unit: '%' },
];

const DASHBOARD_PERFORMERS: DashboardPerformer[] = [
  { id: '1', name: 'Avery Quinn', role: 'Account exec', score: '$28.4k', trend: 'up', avatarUrl: 'https://i.pravatar.cc/120?u=perf-1' },
  { id: '2', name: 'Riley Chen', role: 'Account exec', score: '$24.1k', trend: 'up', avatarUrl: 'https://i.pravatar.cc/120?u=perf-2' },
  { id: '3', name: 'Sasha Romero', role: 'SDR lead', score: '$19.6k', trend: 'up', avatarUrl: 'https://i.pravatar.cc/120?u=perf-3' },
  { id: '4', name: 'Morgan Lee', role: 'Customer success', score: '$12.0k', trend: 'down', avatarUrl: 'https://i.pravatar.cc/120?u=perf-4' },
];

const DASHBOARD_DATE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
];

const DASHBOARD_ACTIVITY: DashboardActivity[] = [
  { id: '1', actor: 'Avery Quinn', avatarUrl: 'https://i.pravatar.cc/120?u=activity-1', action: 'Closed deal · Acme Corp Q3', channel: 'Sales', region: 'NA', priority: 'high', impact: '+$24.0k', status: 'completed', timestamp: '2026-05-30T09:14:00Z' },
  { id: '2', actor: 'Jordan Patel', avatarUrl: 'https://i.pravatar.cc/120?u=activity-2', action: 'Updated forecast model', channel: 'Product', region: 'EMEA', priority: 'medium', impact: '+$8.2k', status: 'in_review', timestamp: '2026-05-29T16:48:00Z' },
  { id: '3', actor: 'Sasha Romero', avatarUrl: 'https://i.pravatar.cc/120?u=activity-3', action: 'New audience segment created', channel: 'Marketing', region: 'NA', priority: 'medium', impact: '+$4.6k', status: 'completed', timestamp: '2026-05-29T11:02:00Z' },
  { id: '4', actor: 'Morgan Lee', avatarUrl: 'https://i.pravatar.cc/120?u=activity-4', action: 'Pending campaign approval', channel: 'Marketing', region: 'APAC', priority: 'low', impact: '+$1.1k', status: 'pending', timestamp: '2026-05-28T18:35:00Z' },
  { id: '5', actor: 'Riley Chen', avatarUrl: 'https://i.pravatar.cc/120?u=activity-5', action: 'Integration test passed', channel: 'Engineering', region: 'EMEA', priority: 'high', impact: '+$12.5k', status: 'completed', timestamp: '2026-05-28T08:21:00Z' },
];

const dashboardStatusStyler = (value: unknown): string => {
  switch (value) {
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'pending':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'in_review':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300';
    default:
      return '';
  }
};

const dashboardPriorityStyler = (value: unknown): string => {
  switch (value) {
    case 'high':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300';
    case 'medium':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'low':
      return 'bg-slate-500/15 text-slate-700 dark:text-slate-300';
    default:
      return '';
  }
};

const dashboardChannelStyler = (value: unknown): string => {
  switch (value) {
    case 'Sales':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'Marketing':
      return 'bg-violet-500/15 text-violet-700 dark:text-violet-300';
    case 'Engineering':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300';
    case 'Product':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    default:
      return '';
  }
};

const DASHBOARD_ACTIVITY_COLUMNS: Column<DashboardActivity>[] = [
  {
    id: 'actor',
    header: 'Owner',
    accessorKey: 'actor',
    type: CellType.TEXT,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar src={row.original.avatarUrl} alt={row.original.actor} size='sm' />
        <span className='text-sm text-foreground'>{row.original.actor}</span>
      </div>
    ),
  },
  { id: 'action', header: 'Activity', accessorKey: 'action', type: CellType.TEXT },
  { id: 'channel', header: 'Channel', accessorKey: 'channel', type: CellType.CHIP, styler: dashboardChannelStyler, showFrom: 'md' },
  { id: 'region', header: 'Region', accessorKey: 'region', type: CellType.TEXT, showFrom: 'lg' },
  { id: 'priority', header: 'Priority', accessorKey: 'priority', type: CellType.STATUS, styler: dashboardPriorityStyler, showFrom: 'md' },
  { id: 'impact', header: 'Impact', accessorKey: 'impact', type: CellType.TEXT, showFrom: 'lg' },
  { id: 'status', header: 'Status', accessorKey: 'status', type: CellType.STATUS, styler: dashboardStatusStyler },
  { id: 'timestamp', header: 'When', accessorKey: 'timestamp', type: CellType.DATE },
];

const formatCurrency = (value: number, unit: string): string => {
  if (unit === '$') {
    return '$' + Math.round(value / 100) / 10 + 'k';
  }
  if (unit === '%') {
    return value + '%';
  }
  return value.toLocaleString();
};

export function DashboardFlowPreview() {
  const [activeNav, setActiveNav] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [focusedKpi, setFocusedKpi] = useState<string | null>('users');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const debouncedQuery = useDebounce(searchInput, 250);
  const { paginationParams, handleSearch } = useSearchPagination();
  const activeQuery = paginationParams.query ?? '';

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const sessionsData = useMemo(
    () => (dateRange === '30d' ? DASHBOARD_SESSIONS_30D : DASHBOARD_SESSIONS_7D),
    [dateRange],
  );

  const dateRangeLabel = useMemo(
    () =>
      DASHBOARD_DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)
        ?.label ?? 'Custom range',
    [dateRange],
  );

  const sidebarItems: SideBarMenuItem[] = useMemo(
    () =>
      DASHBOARD_NAV.map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        group: item.group,
        isActive: activeNav === item.key || activeNav.startsWith(\`\${item.key}.\`),
        onSelect: () => setActiveNav(item.key),
        items: item.items?.map((subItem) => ({
          key: subItem.key,
          label: subItem.label,
          isActive: activeNav === subItem.key,
          onSelect: () => setActiveNav(subItem.key),
        })),
      })),
    [activeNav],
  );

  const activeNavLabel = useMemo(() => {
    for (const item of DASHBOARD_NAV) {
      if (item.key === activeNav) {
        return item.label;
      }
      const subMatch = item.items?.find((sub) => sub.key === activeNav);
      if (subMatch) {
        return \`\${item.label} · \${subMatch.label}\`;
      }
    }
    return activeNav;
  }, [activeNav]);

  const selectedActivity = useMemo(
    () =>
      DASHBOARD_ACTIVITY.find((row) => row.id === selectedActivityId) ?? null,
    [selectedActivityId],
  );

  const filteredActivity = useMemo(() => {
    const needle = activeQuery.trim().toLowerCase();
    if (!needle) {
      return DASHBOARD_ACTIVITY;
    }
    return DASHBOARD_ACTIVITY.filter(
      (row) =>
        row.actor.toLowerCase().includes(needle) ||
        row.action.toLowerCase().includes(needle),
    );
  }, [activeQuery]);

  return (
    <SideBar
      menuItems={sidebarItems}
      user={{ name: 'Avery Quinn', email: 'avery@rapidset.io' }}
      providerProps={{ defaultOpen: true }}
      collapsible='icon'
      brand={
        <SideBarBrand
          title='RapidKit'
          subtitle='Workspace'
          logo={<Image src='/rapidkit.svg' alt='RapidKit' size='sm' className='h-7 w-7' />}
        />
      }
      mainContent={
        <main className='flex min-w-0 flex-1 flex-col bg-background'>
          <header className='sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:px-6'>
            <SideBarTrigger className='shrink-0' />
            <div className='flex-1 min-w-[12rem] max-w-md'>
              <Search
                placeholder='Search activity, owners, campaigns...'
                value={searchInput}
                onChange={setSearchInput}
                ariaLabel='Search dashboard'
              />
            </div>
            <div className='ml-auto flex items-center gap-2'>
              <Button
                type='button'
                variant={ButtonVariant.Outlined}
                leftIcon={Plus}
                label='New report'
              />
              <button
                type='button'
                aria-label='Notifications'
                onClick={() => setNotificationsRead(true)}
                className='relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                <Bell className='h-4 w-4' aria-hidden='true' />
                {notificationsRead ? null : (
                  <span className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive' />
                )}
              </button>
              <Avatar src='https://i.pravatar.cc/120?u=header-avery' alt='Avery Quinn' size='sm' />
            </div>
          </header>

          <Page
            enableSearch={false}
            className='min-h-[44rem] w-full rounded-none bg-background p-0 max-h-none'
          >
            <div className='h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-8'>
              <section className='flex flex-wrap items-end justify-between gap-3'>
                <div className='space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Chip
                      label='Live'
                      icon={Zap}
                      variant='outline'
                      size='sm'
                      pulse
                      className='border-primary/40 bg-primary/10 text-primary'
                    />
                    <Chip
                      label={dateRangeLabel}
                      icon={Clock}
                      variant='outline'
                      size='sm'
                      className='border-border bg-card text-muted-foreground'
                    />
                  </div>
                  <Text as='p' className='text-3xl font-semibold tracking-tight text-foreground'>
                    Workspace overview
                  </Text>
                  <Text as='p' tone='muted' className='max-w-2xl text-sm'>
                    Viewing {activeNavLabel}. Use the collapse button to toggle the rail, expand a section to jump into a sub-area, then drill into a KPI or a row to refocus the page.
                  </Text>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-44'>
                    <DropDown
                      value={dateRange}
                      onChange={setDateRange}
                      options={DASHBOARD_DATE_RANGE_OPTIONS}
                    />
                  </div>
                  <Button
                    type='button'
                    variant={ButtonVariant.Outlined}
                    leftIcon={Download}
                    label='Export'
                  />
                </div>
              </section>

              <section className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4'>
                {DASHBOARD_KPIS.map((kpi) => (
                  <StatCard
                    key={kpi.key}
                    label={kpi.label}
                    value={kpi.value}
                    icon={kpi.icon}
                    delta={kpi.delta}
                    trend={kpi.trend}
                    description={focusedKpi === kpi.key ? 'Selected' : undefined}
                    onClick={() => setFocusedKpi(kpi.key)}
                    className={
                      focusedKpi === kpi.key
                        ? 'shadow-sm ring-2 ring-primary/30'
                        : 'shadow-sm'
                    }
                  />
                ))}
              </section>

              <section className='mt-6 grid gap-3 lg:grid-cols-3'>
                <div className='rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <LineChart className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
                      <Text as='p' className='text-sm font-medium text-foreground'>
                        Sessions & sign-ups
                      </Text>
                    </div>
                    <Chip
                      label={dateRangeLabel}
                      variant='outline'
                      size='sm'
                      className='border-border bg-muted text-muted-foreground'
                    />
                  </div>
                  <Chart
                    type={ChartVariant.Area}
                    data={sessionsData}
                    config={DASHBOARD_SESSIONS_CONFIG}
                    series={[{ dataKey: 'sessions' }, { dataKey: 'signups' }]}
                    xAxisKey='day'
                    stacked
                    smooth
                    height={240}
                    legendPlacement='bottom'
                  />
                </div>
                <div className='rounded-xl border border-border bg-card p-4 shadow-sm'>
                  <div className='mb-3 flex items-center gap-2'>
                    <Globe2 className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
                    <Text as='p' className='text-sm font-medium text-foreground'>
                      Traffic sources
                    </Text>
                  </div>
                  <Chart
                    type={ChartVariant.Pie}
                    data={DASHBOARD_TRAFFIC_SOURCES}
                    config={DASHBOARD_TRAFFIC_CONFIG}
                    dataKey='visits'
                    nameKey='source'
                    height={240}
                    legendPlacement='bottom'
                  />
                </div>
              </section>

              <section className='mt-6 grid gap-3 lg:grid-cols-3'>
                <div className='rounded-xl border border-border bg-card p-4 shadow-sm'>
                  <div className='mb-3 flex items-center gap-2'>
                    <MousePointerClick className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
                    <Text as='p' className='text-sm font-medium text-foreground'>
                      Top channels
                    </Text>
                  </div>
                  <Chart
                    type={ChartVariant.Bar}
                    data={DASHBOARD_CHANNELS}
                    config={DASHBOARD_CHANNELS_CONFIG}
                    series={[{ dataKey: 'conversions' }]}
                    xAxisKey='channel'
                    layout='vertical'
                    showLegend={false}
                    height={240}
                    barRadius={6}
                  />
                </div>

                <div className='rounded-xl border border-border bg-card p-4 shadow-sm'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Target className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
                      <Text as='p' className='text-sm font-medium text-foreground'>
                        Quarter goals
                      </Text>
                    </div>
                    <Chip
                      label='Q3'
                      icon={CalendarCheck}
                      variant='outline'
                      size='sm'
                      className='border-border bg-muted text-muted-foreground'
                    />
                  </div>
                  <ul className='space-y-4'>
                    {DASHBOARD_GOALS.map((goal) => {
                      const pct = Math.min(
                        100,
                        Math.round((goal.current / goal.target) * 100),
                      );
                      const onTrack = pct >= 80;
                      return (
                        <li key={goal.key}>
                          <div className='flex items-center justify-between gap-2'>
                            <Text as='p' className='text-sm font-medium text-foreground'>
                              {goal.label}
                            </Text>
                            <Text as='p' tone='muted' className='text-xs'>
                              {formatCurrency(goal.current, goal.unit)} / {formatCurrency(goal.target, goal.unit)}
                            </Text>
                          </div>
                          <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-muted'>
                            <div
                              className={
                                onTrack
                                  ? 'h-full rounded-full bg-primary transition-all'
                                  : 'h-full rounded-full bg-amber-500 transition-all'
                              }
                              style={{ width: pct + '%' }}
                              role='progressbar'
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={pct}
                              aria-label={goal.label + ' progress'}
                            />
                          </div>
                          <div className='mt-1 flex items-center gap-1.5 text-xs text-muted-foreground'>
                            {onTrack ? (
                              <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' aria-hidden='true' />
                            ) : (
                              <Clock className='h-3.5 w-3.5 text-amber-500' aria-hidden='true' />
                            )}
                            <span>{pct}% · {onTrack ? 'On track' : 'Needs push'}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className='rounded-xl border border-border bg-card p-4 shadow-sm'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <UserPlus className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
                      <Text as='p' className='text-sm font-medium text-foreground'>
                        Top performers
                      </Text>
                    </div>
                    <Button
                      type='button'
                      variant={ButtonVariant.Text}
                      label='View team'
                    />
                  </div>
                  <ul className='space-y-3'>
                    {DASHBOARD_PERFORMERS.map((person) => (
                      <li
                        key={person.id}
                        className='flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2'
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar src={person.avatarUrl} alt={person.name} size='sm' />
                          <div>
                            <Text as='p' className='text-sm font-medium text-foreground'>
                              {person.name}
                            </Text>
                            <Text as='p' tone='muted' className='text-xs'>
                              {person.role}
                            </Text>
                          </div>
                        </div>
                        <Chip
                          label={person.score}
                          variant='outline'
                          size='sm'
                          icon={person.trend === 'up' ? TrendingUp : Activity}
                          className={
                            person.trend === 'up'
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                              : 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className='mt-6 rounded-xl border border-border bg-card p-4 shadow-sm'>
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <FolderOpen className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
                    <Text as='p' className='text-sm font-medium text-foreground'>
                      Recent media
                    </Text>
                  </div>
                  <Chip
                    label={\`\${DASHBOARD_MEDIA.length} assets\`}
                    variant='outline'
                    size='sm'
                    className='border-border bg-muted text-muted-foreground'
                  />
                </div>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
                  {DASHBOARD_MEDIA.map((asset) => (
                    <figure key={asset.id} className='flex flex-col gap-1.5'>
                      <Image
                        src={asset.src}
                        alt={asset.caption}
                        size='md'
                        className='h-20 w-full rounded-md object-cover'
                        loading='lazy'
                      />
                      <figcaption className='truncate text-xs text-muted-foreground'>
                        {asset.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section className='mt-6 rounded-xl border border-border bg-card p-4 shadow-sm'>
                <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                  <div>
                    <Text as='p' className='text-sm font-medium text-foreground'>
                      Recent activity
                    </Text>
                    {selectedActivity ? (
                      <Text as='p' tone='muted' className='text-xs'>
                        Selected · {selectedActivity.actor} — {selectedActivity.action}
                      </Text>
                    ) : (
                      <Text as='p' tone='muted' className='text-xs'>
                        {activeQuery
                          ? \`\${filteredActivity.length} match\${filteredActivity.length === 1 ? '' : 'es'} for "\${activeQuery}"\`
                          : 'Click a row to inspect it'}
                      </Text>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Chip
                      label='Live feed'
                      icon={Mail}
                      variant='outline'
                      size='sm'
                      className='border-border bg-muted text-muted-foreground'
                    />
                  </div>
                </div>
                <BaseTable<DashboardActivity>
                  data={filteredActivity}
                  columns={DASHBOARD_ACTIVITY_COLUMNS}
                  activeItem={selectedActivity}
                  onRowClicked={(row) => setSelectedActivityId(row.id)}
                  responsive={false}
                />
              </section>
            </div>
          </Page>
        </main>
      }
    />
  );
}
`;

const DASHBOARD_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const DASHBOARD_LOGO_SRC = `${DASHBOARD_BASE_PATH}/rapidkit.svg`;

type DashboardActivity = {
  id: string;
  actor: string;
  avatarUrl: string;
  action: string;
  channel: 'Sales' | 'Marketing' | 'Engineering' | 'Product';
  region: 'NA' | 'EMEA' | 'APAC';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  status: 'completed' | 'pending' | 'in_review';
  timestamp: string;
};

type DashboardKpi = {
  key: string;
  label: string;
  value: string;
  delta: string;
  trend: StatCardTrend;
  icon: typeof Users;
};

type DashboardGoal = {
  key: string;
  label: string;
  current: number;
  target: number;
  unit: string;
};

type DashboardPerformer = {
  id: string;
  name: string;
  role: string;
  score: string;
  trend: StatCardTrend;
  avatarUrl: string;
};

type DashboardMediaAsset = {
  id: string;
  src: string;
  caption: string;
};

type DashboardNavItem = {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
  items?: ReadonlyArray<{ key: string; label: string }>;
};

const DASHBOARD_NAV: ReadonlyArray<DashboardNavItem> = [
  {
    key: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    group: 'Workspace',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    group: 'Workspace',
    items: [
      { key: 'analytics.acquisition', label: 'Acquisition' },
      { key: 'analytics.engagement', label: 'Engagement' },
      { key: 'analytics.retention', label: 'Retention' },
    ],
  },
  { key: 'audiences', label: 'Audiences', icon: Users, group: 'Audience' },
  {
    key: 'campaigns',
    label: 'Campaigns',
    icon: Target,
    group: 'Audience',
    items: [
      { key: 'campaigns.active', label: 'Active' },
      { key: 'campaigns.drafts', label: 'Drafts' },
      { key: 'campaigns.archive', label: 'Archive' },
    ],
  },
  { key: 'alerts', label: 'Alerts', icon: Bell, group: 'System' },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    group: 'System',
    items: [
      { key: 'settings.profile', label: 'Profile' },
      { key: 'settings.team', label: 'Team' },
      { key: 'settings.billing', label: 'Billing' },
    ],
  },
];

const DASHBOARD_MEDIA: DashboardMediaAsset[] = [
  {
    id: 'media-1',
    src: 'https://picsum.photos/seed/rapidkit-1/400/300',
    caption: 'Q3 launch teaser',
  },
  {
    id: 'media-2',
    src: 'https://picsum.photos/seed/rapidkit-2/400/300',
    caption: 'Brand refresh',
  },
  {
    id: 'media-3',
    src: 'https://picsum.photos/seed/rapidkit-3/400/300',
    caption: 'Pricing hero',
  },
  {
    id: 'media-4',
    src: 'https://picsum.photos/seed/rapidkit-4/400/300',
    caption: 'Onboarding cover',
  },
  {
    id: 'media-5',
    src: 'https://picsum.photos/seed/rapidkit-5/400/300',
    caption: 'Webinar slide',
  },
  {
    id: 'media-6',
    src: 'https://picsum.photos/seed/rapidkit-6/400/300',
    caption: 'Help center icon',
  },
];

const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    key: 'users',
    label: 'Active users',
    value: '24,318',
    delta: '+12.4%',
    trend: 'up',
    icon: Users,
  },
  {
    key: 'revenue',
    label: 'Revenue',
    value: '$84,210',
    delta: '+8.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    key: 'conversion',
    label: 'Conversion rate',
    value: '3.42%',
    delta: '-0.6%',
    trend: 'down',
    icon: TrendingUp,
  },
  {
    key: 'sessions',
    label: 'Sessions',
    value: '109,884',
    delta: '+4.7%',
    trend: 'up',
    icon: Activity,
  },
];

const DASHBOARD_SESSIONS_7D = [
  { day: 'Mon', sessions: 12400, signups: 480 },
  { day: 'Tue', sessions: 13280, signups: 512 },
  { day: 'Wed', sessions: 14820, signups: 575 },
  { day: 'Thu', sessions: 15960, signups: 612 },
  { day: 'Fri', sessions: 17120, signups: 698 },
  { day: 'Sat', sessions: 13740, signups: 540 },
  { day: 'Sun', sessions: 12290, signups: 470 },
];

const DASHBOARD_SESSIONS_30D = [
  { day: 'W1', sessions: 84200, signups: 3120 },
  { day: 'W2', sessions: 91440, signups: 3478 },
  { day: 'W3', sessions: 98820, signups: 3712 },
  { day: 'W4', sessions: 102310, signups: 3940 },
];

const DASHBOARD_SESSIONS_CONFIG: ChartConfig = {
  sessions: { label: 'Sessions' },
  signups: { label: 'Sign-ups' },
};

const DASHBOARD_TRAFFIC_SOURCES = [
  { source: 'Organic', visits: 4280 },
  { source: 'Referral', visits: 2190 },
  { source: 'Paid', visits: 1840 },
  { source: 'Email', visits: 1320 },
  { source: 'Social', visits: 980 },
];

const DASHBOARD_TRAFFIC_CONFIG: ChartConfig = {
  Organic: { label: 'Organic' },
  Referral: { label: 'Referral' },
  Paid: { label: 'Paid' },
  Email: { label: 'Email' },
  Social: { label: 'Social' },
};

const DASHBOARD_CHANNELS = [
  { channel: 'Search', conversions: 1240 },
  { channel: 'Social', conversions: 980 },
  { channel: 'Email', conversions: 780 },
  { channel: 'Direct', conversions: 540 },
  { channel: 'Partners', conversions: 320 },
];

const DASHBOARD_CHANNELS_CONFIG: ChartConfig = {
  conversions: { label: 'Conversions' },
};

const DASHBOARD_GOALS: DashboardGoal[] = [
  {
    key: 'mrr',
    label: 'Monthly recurring revenue',
    current: 68000,
    target: 80000,
    unit: '$',
  },
  {
    key: 'qsignups',
    label: 'Quarterly sign-ups',
    current: 5420,
    target: 7500,
    unit: '',
  },
  { key: 'csat', label: 'CSAT score', current: 84, target: 90, unit: '%' },
];

const DASHBOARD_PERFORMERS: DashboardPerformer[] = [
  {
    id: '1',
    name: 'Avery Quinn',
    role: 'Account exec',
    score: '$28.4k',
    trend: 'up',
    avatarUrl: 'https://i.pravatar.cc/120?u=perf-1',
  },
  {
    id: '2',
    name: 'Riley Chen',
    role: 'Account exec',
    score: '$24.1k',
    trend: 'up',
    avatarUrl: 'https://i.pravatar.cc/120?u=perf-2',
  },
  {
    id: '3',
    name: 'Sasha Romero',
    role: 'SDR lead',
    score: '$19.6k',
    trend: 'up',
    avatarUrl: 'https://i.pravatar.cc/120?u=perf-3',
  },
  {
    id: '4',
    name: 'Morgan Lee',
    role: 'Customer success',
    score: '$12.0k',
    trend: 'down',
    avatarUrl: 'https://i.pravatar.cc/120?u=perf-4',
  },
];

const DASHBOARD_DATE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
];

const DASHBOARD_ACTIVITY: DashboardActivity[] = [
  {
    id: '1',
    actor: 'Avery Quinn',
    avatarUrl: 'https://i.pravatar.cc/120?u=activity-1',
    action: 'Closed deal · Acme Corp Q3',
    channel: 'Sales',
    region: 'NA',
    priority: 'high',
    impact: '+$24.0k',
    status: 'completed',
    timestamp: '2026-05-30T09:14:00Z',
  },
  {
    id: '2',
    actor: 'Jordan Patel',
    avatarUrl: 'https://i.pravatar.cc/120?u=activity-2',
    action: 'Updated forecast model',
    channel: 'Product',
    region: 'EMEA',
    priority: 'medium',
    impact: '+$8.2k',
    status: 'in_review',
    timestamp: '2026-05-29T16:48:00Z',
  },
  {
    id: '3',
    actor: 'Sasha Romero',
    avatarUrl: 'https://i.pravatar.cc/120?u=activity-3',
    action: 'New audience segment created',
    channel: 'Marketing',
    region: 'NA',
    priority: 'medium',
    impact: '+$4.6k',
    status: 'completed',
    timestamp: '2026-05-29T11:02:00Z',
  },
  {
    id: '4',
    actor: 'Morgan Lee',
    avatarUrl: 'https://i.pravatar.cc/120?u=activity-4',
    action: 'Pending campaign approval',
    channel: 'Marketing',
    region: 'APAC',
    priority: 'low',
    impact: '+$1.1k',
    status: 'pending',
    timestamp: '2026-05-28T18:35:00Z',
  },
  {
    id: '5',
    actor: 'Riley Chen',
    avatarUrl: 'https://i.pravatar.cc/120?u=activity-5',
    action: 'Integration test passed',
    channel: 'Engineering',
    region: 'EMEA',
    priority: 'high',
    impact: '+$12.5k',
    status: 'completed',
    timestamp: '2026-05-28T08:21:00Z',
  },
];

const dashboardStatusStyler = (value: unknown): string => {
  switch (value) {
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'pending':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'in_review':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300';
    default:
      return '';
  }
};

const dashboardPriorityStyler = (value: unknown): string => {
  switch (value) {
    case 'high':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300';
    case 'medium':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'low':
      return 'bg-slate-500/15 text-slate-700 dark:text-slate-300';
    default:
      return '';
  }
};

const dashboardChannelStyler = (value: unknown): string => {
  switch (value) {
    case 'Sales':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'Marketing':
      return 'bg-violet-500/15 text-violet-700 dark:text-violet-300';
    case 'Engineering':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300';
    case 'Product':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    default:
      return '';
  }
};

const DASHBOARD_ACTIVITY_COLUMNS: Column<DashboardActivity>[] = [
  {
    id: 'actor',
    header: 'Owner',
    accessorKey: 'actor',
    type: CellType.TEXT,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={row.original.avatarUrl}
          alt={row.original.actor}
          size="sm"
        />
        <span className="text-sm text-foreground">{row.original.actor}</span>
      </div>
    ),
  },
  {
    id: 'action',
    header: 'Activity',
    accessorKey: 'action',
    type: CellType.TEXT,
  },
  {
    id: 'channel',
    header: 'Channel',
    accessorKey: 'channel',
    type: CellType.CHIP,
    styler: dashboardChannelStyler,
    showFrom: 'md',
  },
  {
    id: 'region',
    header: 'Region',
    accessorKey: 'region',
    type: CellType.TEXT,
    showFrom: 'lg',
  },
  {
    id: 'priority',
    header: 'Priority',
    accessorKey: 'priority',
    type: CellType.STATUS,
    styler: dashboardPriorityStyler,
    showFrom: 'md',
  },
  {
    id: 'impact',
    header: 'Impact',
    accessorKey: 'impact',
    type: CellType.TEXT,
    showFrom: 'lg',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    type: CellType.STATUS,
    styler: dashboardStatusStyler,
  },
  {
    id: 'timestamp',
    header: 'When',
    accessorKey: 'timestamp',
    type: CellType.DATE,
  },
];

const formatGoalValue = (value: number, unit: string): string => {
  if (unit === '$') {
    return `$${Math.round(value / 100) / 10}k`;
  }
  if (unit === '%') {
    return `${value}%`;
  }
  return value.toLocaleString();
};

function DashboardFlowPreview(): JSX.Element {
  const [activeNav, setActiveNav] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [focusedKpi, setFocusedKpi] = useState<string | null>('users');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const debouncedQuery = useDebounce(searchInput, 250);
  const { paginationParams, handleSearch } = useSearchPagination();
  const activeQuery = paginationParams.query ?? '';

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const sessionsData = useMemo(
    () =>
      dateRange === '30d' ? DASHBOARD_SESSIONS_30D : DASHBOARD_SESSIONS_7D,
    [dateRange],
  );

  const dateRangeLabel = useMemo(
    () =>
      DASHBOARD_DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)
        ?.label ?? 'Custom range',
    [dateRange],
  );

  const sidebarItems: SideBarMenuItem[] = useMemo(
    () =>
      DASHBOARD_NAV.map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        group: item.group,
        isActive:
          activeNav === item.key || activeNav.startsWith(`${item.key}.`),
        onSelect: () => setActiveNav(item.key),
        items: item.items?.map((subItem) => ({
          key: subItem.key,
          label: subItem.label,
          isActive: activeNav === subItem.key,
          onSelect: () => setActiveNav(subItem.key),
        })),
      })),
    [activeNav],
  );

  const activeNavLabel = useMemo(() => {
    for (const item of DASHBOARD_NAV) {
      if (item.key === activeNav) {
        return item.label;
      }
      const subMatch = item.items?.find((sub) => sub.key === activeNav);
      if (subMatch) {
        return `${item.label} · ${subMatch.label}`;
      }
    }
    return activeNav;
  }, [activeNav]);

  const selectedActivity = useMemo(
    () =>
      DASHBOARD_ACTIVITY.find((row) => row.id === selectedActivityId) ?? null,
    [selectedActivityId],
  );

  const filteredActivity = useMemo(() => {
    const needle = activeQuery.trim().toLowerCase();
    if (!needle) {
      return DASHBOARD_ACTIVITY;
    }
    return DASHBOARD_ACTIVITY.filter(
      (row) =>
        row.actor.toLowerCase().includes(needle) ||
        row.action.toLowerCase().includes(needle),
    );
  }, [activeQuery]);

  return (
    <SideBar
      menuItems={sidebarItems}
      user={{ name: 'Avery Quinn', email: 'avery@rapidset.io' }}
      providerProps={{ defaultOpen: true }}
      collapsible="icon"
      brand={
        <SideBarBrand
          title="RapidKit"
          subtitle="Workspace"
          logo={
            <Image
              src={DASHBOARD_LOGO_SRC}
              alt="RapidKit"
              size="sm"
              className="h-7 w-7"
            />
          }
        />
      }
      mainContent={
        <main className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:px-6">
            <SideBarTrigger className="shrink-0" />
            <div className="min-w-[12rem] max-w-md flex-1">
              <Search
                placeholder="Search activity, owners, campaigns..."
                value={searchInput}
                onChange={setSearchInput}
                ariaLabel="Search dashboard"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant={ButtonVariant.Outlined}
                leftIcon={Plus}
                label="New report"
              />
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setNotificationsRead(true)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {notificationsRead ? null : (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </button>
              <Avatar
                src="https://i.pravatar.cc/120?u=header-avery"
                alt="Avery Quinn"
                size="sm"
              />
            </div>
          </header>

          <Page
            enableSearch={false}
            className="min-h-[44rem] w-full rounded-none bg-background p-0 max-h-none"
          >
            <div className="h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-8">
              <section className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip
                      label="Live"
                      icon={Zap}
                      variant="outline"
                      size="sm"
                      pulse
                      className="border-primary/40 bg-primary/10 text-primary"
                    />
                    <Chip
                      label={dateRangeLabel}
                      icon={Clock}
                      variant="outline"
                      size="sm"
                      className="border-border bg-card text-muted-foreground"
                    />
                  </div>
                  <Text
                    as="p"
                    className="text-3xl font-semibold tracking-tight text-foreground"
                  >
                    Workspace overview
                  </Text>
                  <Text as="p" tone="muted" className="max-w-2xl text-sm">
                    Viewing {activeNavLabel}. Use the collapse button to toggle
                    the rail, expand a section to jump into a sub-area, then
                    drill into a KPI or a row to refocus the page.
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-44">
                    <DropDown
                      value={dateRange}
                      onChange={setDateRange}
                      options={DASHBOARD_DATE_RANGE_OPTIONS}
                    />
                  </div>
                  <Button
                    type="button"
                    variant={ButtonVariant.Outlined}
                    leftIcon={Download}
                    label="Export"
                  />
                </div>
              </section>

              <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {DASHBOARD_KPIS.map((kpi) => (
                  <StatCard
                    key={kpi.key}
                    label={kpi.label}
                    value={kpi.value}
                    icon={kpi.icon}
                    delta={kpi.delta}
                    trend={kpi.trend}
                    description={
                      focusedKpi === kpi.key ? 'Selected' : undefined
                    }
                    onClick={() => setFocusedKpi(kpi.key)}
                    className={
                      focusedKpi === kpi.key
                        ? 'shadow-sm ring-2 ring-primary/30'
                        : 'shadow-sm'
                    }
                  />
                ))}
              </section>

              <section className="mt-6 grid gap-3 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LineChart
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Text
                        as="p"
                        className="text-sm font-medium text-foreground"
                      >
                        Sessions & sign-ups
                      </Text>
                    </div>
                    <Chip
                      label={dateRangeLabel}
                      variant="outline"
                      size="sm"
                      className="border-border bg-muted text-muted-foreground"
                    />
                  </div>
                  <Chart
                    type={ChartVariant.Area}
                    data={sessionsData}
                    config={DASHBOARD_SESSIONS_CONFIG}
                    series={[{ dataKey: 'sessions' }, { dataKey: 'signups' }]}
                    xAxisKey="day"
                    stacked
                    smooth
                    height={240}
                    legendPlacement="bottom"
                  />
                </div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Globe2
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Text
                      as="p"
                      className="text-sm font-medium text-foreground"
                    >
                      Traffic sources
                    </Text>
                  </div>
                  <Chart
                    type={ChartVariant.Pie}
                    data={DASHBOARD_TRAFFIC_SOURCES}
                    config={DASHBOARD_TRAFFIC_CONFIG}
                    dataKey="visits"
                    nameKey="source"
                    height={240}
                    legendPlacement="bottom"
                  />
                </div>
              </section>

              <section className="mt-6 grid gap-3 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <MousePointerClick
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Text
                      as="p"
                      className="text-sm font-medium text-foreground"
                    >
                      Top channels
                    </Text>
                  </div>
                  <Chart
                    type={ChartVariant.Bar}
                    data={DASHBOARD_CHANNELS}
                    config={DASHBOARD_CHANNELS_CONFIG}
                    series={[{ dataKey: 'conversions' }]}
                    xAxisKey="channel"
                    layout="vertical"
                    showLegend={false}
                    height={240}
                    barRadius={6}
                  />
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Text
                        as="p"
                        className="text-sm font-medium text-foreground"
                      >
                        Quarter goals
                      </Text>
                    </div>
                    <Chip
                      label="Q3"
                      icon={CalendarCheck}
                      variant="outline"
                      size="sm"
                      className="border-border bg-muted text-muted-foreground"
                    />
                  </div>
                  <ul className="space-y-4">
                    {DASHBOARD_GOALS.map((goal) => {
                      const pct = Math.min(
                        100,
                        Math.round((goal.current / goal.target) * 100),
                      );
                      const onTrack = pct >= 80;
                      return (
                        <li key={goal.key}>
                          <div className="flex items-center justify-between gap-2">
                            <Text
                              as="p"
                              className="text-sm font-medium text-foreground"
                            >
                              {goal.label}
                            </Text>
                            <Text as="p" tone="muted" className="text-xs">
                              {formatGoalValue(goal.current, goal.unit)} /{' '}
                              {formatGoalValue(goal.target, goal.unit)}
                            </Text>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={
                                onTrack
                                  ? 'h-full rounded-full bg-primary transition-all'
                                  : 'h-full rounded-full bg-amber-500 transition-all'
                              }
                              style={{ width: `${pct}%` }}
                              role="progressbar"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={pct}
                              aria-label={`${goal.label} progress`}
                            />
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            {onTrack ? (
                              <CheckCircle2
                                className="h-3.5 w-3.5 text-emerald-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <Clock
                                className="h-3.5 w-3.5 text-amber-500"
                                aria-hidden="true"
                              />
                            )}
                            <span>
                              {pct}% · {onTrack ? 'On track' : 'Needs push'}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Text
                        as="p"
                        className="text-sm font-medium text-foreground"
                      >
                        Top performers
                      </Text>
                    </div>
                    <Button
                      type="button"
                      variant={ButtonVariant.Text}
                      label="View team"
                    />
                  </div>
                  <ul className="space-y-3">
                    {DASHBOARD_PERFORMERS.map((person) => (
                      <li
                        key={person.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={person.avatarUrl}
                            alt={person.name}
                            size="sm"
                          />
                          <div>
                            <Text
                              as="p"
                              className="text-sm font-medium text-foreground"
                            >
                              {person.name}
                            </Text>
                            <Text as="p" tone="muted" className="text-xs">
                              {person.role}
                            </Text>
                          </div>
                        </div>
                        <Chip
                          label={person.score}
                          variant="outline"
                          size="sm"
                          icon={person.trend === 'up' ? TrendingUp : Activity}
                          className={
                            person.trend === 'up'
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                              : 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Text
                      as="p"
                      className="text-sm font-medium text-foreground"
                    >
                      Recent media
                    </Text>
                  </div>
                  <Chip
                    label={`${DASHBOARD_MEDIA.length} assets`}
                    variant="outline"
                    size="sm"
                    className="border-border bg-muted text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {DASHBOARD_MEDIA.map((asset) => (
                    <figure key={asset.id} className="flex flex-col gap-1.5">
                      <Image
                        src={asset.src}
                        alt={asset.caption}
                        size="md"
                        className="h-20 w-full rounded-md object-cover"
                        loading="lazy"
                      />
                      <figcaption className="truncate text-xs text-muted-foreground">
                        {asset.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Text
                      as="p"
                      className="text-sm font-medium text-foreground"
                    >
                      Recent activity
                    </Text>
                    {selectedActivity ? (
                      <Text as="p" tone="muted" className="text-xs">
                        Selected · {selectedActivity.actor} —{' '}
                        {selectedActivity.action}
                      </Text>
                    ) : (
                      <Text as="p" tone="muted" className="text-xs">
                        {activeQuery
                          ? `${filteredActivity.length} match${filteredActivity.length === 1 ? '' : 'es'} for "${activeQuery}"`
                          : 'Click a row to inspect it'}
                      </Text>
                    )}
                  </div>
                  <Chip
                    label="Live feed"
                    icon={Mail}
                    variant="outline"
                    size="sm"
                    className="border-border bg-muted text-muted-foreground"
                  />
                </div>
                <BaseTable<DashboardActivity>
                  data={filteredActivity}
                  columns={DASHBOARD_ACTIVITY_COLUMNS}
                  activeItem={selectedActivity}
                  onRowClicked={(row) => setSelectedActivityId(row.id)}
                  responsive={false}
                />
              </section>
            </div>
          </Page>
        </main>
      }
    />
  );
}

const FLOW_EXAMPLES: Record<FlowExampleId, FlowExample> = {
  dashboard: {
    code: DASHBOARD_FLOW_EXAMPLE_CODE,
    render: DashboardFlowPreview,
  },
  login: {
    code: LOGIN_FLOW_EXAMPLE_CODE,
    render: LoginFlowPreview,
  },
};

export const FLOW_EXAMPLE_IDS = Object.keys(FLOW_EXAMPLES) as FlowExampleId[];

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
  previewSrc,
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
      </div>

      <div
        id={previewPanelId}
        role="tabpanel"
        aria-labelledby={previewTabId}
        hidden={activeTab !== 'preview'}
        className="component-example-tabs__panel component-example-tabs__panel--flow"
      >
        <FlowPreviewFrame flow={flow} previewSrc={previewSrc} />
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
