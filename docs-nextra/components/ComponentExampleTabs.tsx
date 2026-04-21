import { useEffect, useMemo, useState, type JSX } from 'react';
import { Autocomplete } from '../../src/components/Autocomplete';
import { BaseModal } from '../../src/components/BaseModal';
import { BaseTable } from '../../src/components/BaseTable';
import { Button, ButtonVariant } from '../../src/components/Button';
import { Checkbox } from '../../src/components/Checkbox';
import { Chip } from '../../src/components/Chip';
import { DatePicker } from '../../src/components/DatePicker';
import { DetailsCard } from '../../src/components/DetailsCard';
import { DropDown } from '../../src/components/DropDown';
import { Icon } from '../../src/components/Icon';
import { Image } from '../../src/components/Image';
import { Input } from '../../src/components/Input';
import { Page } from '../../src/components/Page';
import { Search } from '../../src/components/Search';
import { Text } from '../../src/components/Text';
import { TextArea } from '../../src/components/TextArea';
import { CellType } from '../../src/components/BaseTable/components/BaseTableRow/components/BaseTableCell';
import type { Column } from '../../src/components/BaseTable/components/BaseTableRow';
import { Archive, Bell, Circle, Download, FileText, Plus } from 'lucide-react';

export type ComponentExampleId =
  | 'autocomplete'
  | 'base-modal'
  | 'base-table'
  | 'button'
  | 'checkbox'
  | 'chip'
  | 'date-picker'
  | 'details-card'
  | 'drop-down'
  | 'icon'
  | 'image'
  | 'input'
  | 'page'
  | 'search'
  | 'text'
  | 'text-area';

type ExampleConfig = {
  code: string;
  render: () => JSX.Element;
};

type ExampleTabsProps = Readonly<{
  component: ComponentExampleId;
}>;

type ServiceSearchCandidate = {
  name: string;
  owner: string;
  region: string;
  tags: string[];
};

function matchesServiceSearch(
  item: ServiceSearchCandidate,
  searchQuery: string,
): boolean {
  if (!searchQuery) {
    return true;
  }

  const nameMatches = item.name.toLowerCase().includes(searchQuery);
  const ownerMatches = item.owner.toLowerCase().includes(searchQuery);
  const regionMatches = item.region.toLowerCase().includes(searchQuery);
  const tagsNormalized = item.tags.join(' ').toLowerCase();
  const tagMatches = tagsNormalized.includes(searchQuery);

  return nameMatches || ownerMatches || regionMatches || tagMatches;
}

function getNoisyAlertCount(baseAlertsCount: number, rowIndex: number): number {
  if (rowIndex % 4 === 0) {
    return baseAlertsCount + 7;
  }
  if (rowIndex % 3 === 0) {
    return baseAlertsCount + 3;
  }
  return baseAlertsCount;
}

function getNoisyStatus(
  currentStatus: 'active' | 'inactive' | 'degraded',
  rowIndex: number,
): 'active' | 'inactive' | 'degraded' {
  if (rowIndex % 4 === 0) {
    return 'degraded';
  }
  if (rowIndex % 3 === 0) {
    return 'inactive';
  }
  return currentStatus;
}

function toComparableString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry : ''))
      .join(' ')
      .trim();
  }
  return '';
}

function getCopyLabel(copyState: 'idle' | 'done' | 'error'): string {
  if (copyState === 'done') {
    return 'Copied';
  }
  if (copyState === 'error') {
    return 'Failed';
  }
  return 'Copy';
}

type UserOption = {
  id: number;
  name: string;
  email: string;
};

const MOCK_USERS: UserOption[] = [
  { id: 1, name: 'Alex Rivera', email: 'alex@company.com' },
  { id: 2, name: 'Jordan Kim', email: 'jordan@company.com' },
  { id: 3, name: 'Sam Lee', email: 'sam@company.com' },
  { id: 4, name: 'Taylor Morgan', email: 'taylor@company.com' },
];

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function dummySearchUsers(params: {
  query: string;
  page: number;
  size: number;
}): Promise<{
  items: UserOption[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}> {
  await wait(180);

  const needle = params.query.toLowerCase().trim();
  const filtered = MOCK_USERS.filter((item) => {
    if (!needle) {
      return true;
    }

    return (
      item.name.toLowerCase().includes(needle) ||
      item.email.toLowerCase().includes(needle)
    );
  });

  const start = (params.page - 1) * params.size;
  const pagedItems = filtered.slice(start, start + params.size);

  return {
    items: pagedItems,
    currentPage: params.page,
    totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
    totalItems: filtered.length,
  };
}

async function dummyGetUserById(id: number): Promise<UserOption | null> {
  await wait(80);
  return MOCK_USERS.find((user) => user.id === id) ?? null;
}

function AutocompletePreview(): JSX.Element {
  const [selectedId, setSelectedId] = useState<number | null>(2);

  return (
    <div className="space-y-3" style={{ maxWidth: 520 }}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-md border bg-background px-2.5 py-1 text-xs hover:bg-muted"
          onClick={() => setSelectedId(2)}
        >
          Set Jordan
        </button>
        <button
          type="button"
          className="rounded-md border bg-background px-2.5 py-1 text-xs hover:bg-muted"
          onClick={() => setSelectedId(4)}
        >
          Set Taylor
        </button>
        <button
          type="button"
          className="rounded-md border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
          onClick={() => setSelectedId(null)}
        >
          Clear value
        </button>
      </div>

      <Autocomplete<UserOption>
        name="assignee"
        label="Assignee"
        value={selectedId}
        size={4}
        searchOptions={dummySearchUsers}
        getOptionById={dummyGetUserById}
        onSelectOption={(item) => setSelectedId(item?.id ?? null)}
      />
    </div>
  );
}

function BaseModalPreview(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        label="Open Modal"
        variant={ButtonVariant.Outlined}
        onClick={() => setIsOpen(true)}
      />

      <BaseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        description="Update profile settings"
        onSave={() => setIsOpen(false)}
        customButtons={[
          {
            label: 'Preview',
            onClick: () => undefined,
            variant: ButtonVariant.Outlined,
          },
        ]}
      >
        <div className="text-sm text-foreground">Modal content goes here</div>
      </BaseModal>
    </div>
  );
}

function BaseTablePreview(): JSX.Element {
  type ServiceRow = {
    id: number;
    name: string;
    owner: string;
    status: 'active' | 'inactive' | 'degraded';
    tags: string[];
    region: string;
    uptime: string;
    errorRate: string;
    healthScore: string;
    monthlyCost: string;
    alertsCount: number;
    hasDrift: boolean;
    createdAt: string;
    logoUrl: string;
  };

  type QueryParams = {
    query: string;
    page: number;
    size: number;
  };

  type MockScenario = 'normal' | 'slow' | 'empty' | 'error' | 'noisy';

  const DEFAULT_QUERY_PARAMS: QueryParams = {
    query: '',
    page: 1,
    size: 5,
  };

  const DEFAULT_SORT_BY = 'name';
  const DEFAULT_SORT_ORDER: 'asc' | 'desc' = 'asc';

  const allRows: ServiceRow[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Payments API',
        owner: 'Alex Rivera',
        status: 'active',
        tags: ['pci', 'critical'],
        region: 'us-east',
        uptime: '99.97%',
        errorRate: '0.03%',
        healthScore: 'A',
        monthlyCost: '$18.4k',
        alertsCount: 1,
        hasDrift: false,
        createdAt: '2025-02-18',
        logoUrl: 'https://picsum.photos/seed/payments-api/64/64',
      },
      {
        id: 2,
        name: 'Audit Event Bus',
        owner: 'Jordan Kim',
        status: 'degraded',
        tags: ['sox', 'stream'],
        region: 'us-west',
        uptime: '98.20%',
        errorRate: '0.42%',
        healthScore: 'C',
        monthlyCost: '$9.2k',
        alertsCount: 6,
        hasDrift: true,
        createdAt: '2024-11-10',
        logoUrl: 'https://picsum.photos/seed/audit-event-bus/64/64',
      },
      {
        id: 3,
        name: 'Identity Gateway',
        owner: 'Sam Lee',
        status: 'active',
        tags: ['auth', 'critical'],
        region: 'eu-central',
        uptime: '99.91%',
        errorRate: '0.05%',
        healthScore: 'A',
        monthlyCost: '$12.7k',
        alertsCount: 0,
        hasDrift: false,
        createdAt: '2024-09-03',
        logoUrl: 'https://picsum.photos/seed/identity-gateway/64/64',
      },
      {
        id: 4,
        name: 'Catalog Sync',
        owner: 'Taylor Morgan',
        status: 'inactive',
        tags: ['batch', 'internal'],
        region: 'ap-southeast',
        uptime: '95.10%',
        errorRate: '0.96%',
        healthScore: 'D',
        monthlyCost: '$4.1k',
        alertsCount: 4,
        hasDrift: true,
        createdAt: '2023-12-01',
        logoUrl: '',
      },
      {
        id: 5,
        name: 'Notification Hub',
        owner: 'Casey Patel',
        status: 'active',
        tags: ['messaging', 'customer'],
        region: 'us-east',
        uptime: '99.84%',
        errorRate: '0.11%',
        healthScore: 'B',
        monthlyCost: '$7.8k',
        alertsCount: 2,
        hasDrift: false,
        createdAt: '2024-04-22',
        logoUrl: 'https://picsum.photos/seed/notification-hub/64/64',
      },
      {
        id: 6,
        name: 'Settlement Worker',
        owner: 'Riley Chen',
        status: 'degraded',
        tags: ['finance', 'batch'],
        region: 'eu-west',
        uptime: '97.48%',
        errorRate: '0.61%',
        healthScore: 'C',
        monthlyCost: '$10.9k',
        alertsCount: 7,
        hasDrift: true,
        createdAt: '2025-01-11',
        logoUrl: '',
      },
      {
        id: 7,
        name: 'Fraud Rules Engine',
        owner: 'Drew Santos',
        status: 'active',
        tags: ['ml', 'critical'],
        region: 'us-central',
        uptime: '99.75%',
        errorRate: '0.16%',
        healthScore: 'B',
        monthlyCost: '$15.6k',
        alertsCount: 3,
        hasDrift: false,
        createdAt: '2024-10-28',
        logoUrl: 'https://picsum.photos/seed/fraud-rules-engine/64/64',
      },
      {
        id: 8,
        name: 'Search Aggregator',
        owner: 'Morgan Blake',
        status: 'inactive',
        tags: ['search', 'platform'],
        region: 'eu-north',
        uptime: '96.33%',
        errorRate: '0.80%',
        healthScore: 'D',
        monthlyCost: '$5.7k',
        alertsCount: 5,
        hasDrift: true,
        createdAt: '2023-06-14',
        logoUrl: 'https://picsum.photos/seed/search-aggregator/64/64',
      },
      {
        id: 9,
        name: 'Billing Ledger',
        owner: 'Jamie Wright',
        status: 'active',
        tags: ['finance', 'critical'],
        region: 'us-east',
        uptime: '99.88%',
        errorRate: '0.09%',
        healthScore: 'A',
        monthlyCost: '$19.1k',
        alertsCount: 1,
        hasDrift: false,
        createdAt: '2024-02-05',
        logoUrl: 'https://picsum.photos/seed/billing-ledger/64/64',
      },
      {
        id: 10,
        name: 'Webhook Relay',
        owner: 'Avery Cole',
        status: 'degraded',
        tags: ['integration', 'external'],
        region: 'us-west',
        uptime: '97.02%',
        errorRate: '0.55%',
        healthScore: 'C',
        monthlyCost: '$6.4k',
        alertsCount: 8,
        hasDrift: true,
        createdAt: '2024-07-30',
        logoUrl: 'https://picsum.photos/seed/webhook-relay/64/64',
      },
      {
        id: 11,
        name: 'Role Directory',
        owner: 'Parker Reed',
        status: 'active',
        tags: ['rbac', 'internal'],
        region: 'eu-central',
        uptime: '99.69%',
        errorRate: '0.20%',
        healthScore: 'B',
        monthlyCost: '$3.3k',
        alertsCount: 2,
        hasDrift: false,
        createdAt: '2023-10-09',
        logoUrl: 'https://picsum.photos/seed/role-directory/64/64',
      },
      {
        id: 12,
        name: 'Inventory Cache',
        owner: 'Quinn Harper',
        status: 'inactive',
        tags: ['cache', 'platform'],
        region: 'ap-southeast',
        uptime: '95.88%',
        errorRate: '0.91%',
        healthScore: 'D',
        monthlyCost: '$2.8k',
        alertsCount: 4,
        hasDrift: true,
        createdAt: '2022-12-19',
        logoUrl: '',
      },
    ],
    [],
  );

  const [queryParams, setQueryParams] =
    useState<QueryParams>(DEFAULT_QUERY_PARAMS);
  const [scenario, setScenario] = useState<MockScenario>('normal');
  const [sortBy, setSortBy] = useState<string | undefined>(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(
    DEFAULT_SORT_ORDER,
  );
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<ServiceRow[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorText(null);
      await wait(scenario === 'slow' ? 900 : 240);

      if (scenario === 'error') {
        if (!isCancelled) {
          setRows([]);
          setTotalItems(0);
          setTotalPages(1);
          setIsLoading(false);
          setErrorText(
            'Mock API error: unable to fetch services. Try switching scenario back to normal.',
          );
        }
        return;
      }

      const searchQuery = queryParams.query.toLowerCase().trim();

      const sourceRows =
        scenario === 'noisy'
          ? allRows.map((item, index) => ({
              ...item,
              alertsCount: getNoisyAlertCount(item.alertsCount, index),
              hasDrift: index % 2 === 0,
              status: getNoisyStatus(item.status, index),
            }))
          : allRows;

      const filtered = sourceRows.filter((item) =>
        matchesServiceSearch(item, searchQuery),
      );

      const effectiveRows = scenario === 'empty' ? [] : filtered;

      const sorted = [...effectiveRows].sort((left, right) => {
        if (!sortBy) {
          return 0;
        }

        const leftValue = toComparableString(
          (left as Record<string, unknown>)[sortBy],
        );
        const rightValue = toComparableString(
          (right as Record<string, unknown>)[sortBy],
        );
        const result = leftValue.localeCompare(rightValue, undefined, {
          numeric: true,
          sensitivity: 'base',
        });

        return sortOrder === 'desc' ? -result : result;
      });

      const calculatedTotalPages = Math.max(
        1,
        Math.ceil(sorted.length / queryParams.size),
      );
      const safePage = Math.min(queryParams.page, calculatedTotalPages);
      const start = (safePage - 1) * queryParams.size;
      const pagedRows = sorted.slice(start, start + queryParams.size);

      if (!isCancelled) {
        setRows(pagedRows);
        setTotalItems(sorted.length);
        setTotalPages(calculatedTotalPages);
        setIsLoading(false);

        if (safePage !== queryParams.page) {
          setQueryParams((previous) => ({
            ...previous,
            page: safePage,
          }));
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [allRows, queryParams, scenario, sortBy, sortOrder]);

  const columns = useMemo<Column<ServiceRow>[]>(
    () => [
      {
        id: 'logo',
        header: 'Logo',
        accessorKey: 'logoUrl' as const,
        type: CellType.IMAGE,
      },
      {
        id: 'name',
        header: 'Service',
        accessorKey: 'name' as const,
        type: CellType.TEXT,
        sortable: true,
      },
      {
        id: 'owner',
        header: 'Owner',
        accessorKey: 'owner' as const,
        type: CellType.AVATAR,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status' as const,
        type: CellType.STATUS,
        sortable: true,
        styler: (value: unknown) => {
          if (value === 'active') {
            return 'bg-green-100 text-green-700';
          }
          if (value === 'degraded') {
            return 'bg-amber-100 text-amber-700';
          }
          return 'bg-slate-100 text-slate-700';
        },
      },
      {
        id: 'tags',
        header: 'Tags',
        accessorKey: 'tags' as const,
        type: CellType.MULTI_STATUS,
      },
      {
        id: 'region',
        header: 'Region',
        accessorKey: 'region' as const,
        type: CellType.CHIP,
      },
      {
        id: 'uptime',
        header: 'Uptime',
        accessorKey: 'uptime' as const,
        type: CellType.DIMENSION,
        sortable: true,
      },
      {
        id: 'monthlyCost',
        header: 'Cost',
        accessorKey: 'monthlyCost' as const,
        type: CellType.DIMENSION,
      },
      {
        id: 'drift',
        header: 'Drift',
        accessorKey: 'hasDrift' as const,
        type: CellType.BOOLEAN,
      },
      {
        id: 'createdAt',
        header: 'Created',
        accessorKey: 'createdAt' as const,
        type: CellType.DATE,
        sortable: true,
      },
      {
        id: 'alertsIcon',
        header: 'Alerts',
        accessorKey: 'alertsCount' as const,
        type: CellType.ICON,
        iconNameMapper: (value: unknown) => {
          if (typeof value === 'number' && value > 5) {
            return 'AlertTriangle';
          }
          if (typeof value === 'number' && value > 0) {
            return 'TriangleAlert';
          }
          return 'ShieldCheck';
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        type: CellType.ACTIONS,
        actions: [
          {
            label: 'Inspect',
            iconName: 'Search' as const,
            variant: 'primary',
            onClick: () => undefined,
          },
          {
            label: 'Restart',
            iconName: 'RotateCcw' as const,
            variant: 'warning',
            onClick: () => undefined,
          },
          {
            label: 'Disable',
            iconName: 'ShieldOff' as const,
            variant: 'danger',
            onClick: () => undefined,
          },
        ],
      },
    ],
    [],
  );

  function resetDemoState() {
    setScenario('normal');
    setQueryParams(DEFAULT_QUERY_PARAMS);
    setSortBy(DEFAULT_SORT_BY);
    setSortOrder(DEFAULT_SORT_ORDER);
    setSelectedRows([]);
    setErrorText(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="text-xs text-muted-foreground">
            <span>Scenario</span>
            <select
              className="ml-2 rounded-md border bg-background px-2 py-1 text-xs"
              value={scenario}
              onChange={(event) => {
                setScenario(event.target.value as MockScenario);
                setQueryParams((previous) => ({ ...previous, page: 1 }));
              }}
            >
              <option value="normal">normal</option>
              <option value="slow">slow response</option>
              <option value="empty">empty result</option>
              <option value="error">error response</option>
              <option value="noisy">high alerts/noisy data</option>
            </select>
          </label>
          <Input
            name="serviceFilter"
            value={queryParams.query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQueryParams((previous) => ({
                ...previous,
                query: nextQuery,
                page: 1,
              }));
            }}
            placeholder="Filter by service, owner, region, or tag"
            className="max-w-[340px]"
          />
          <button
            type="button"
            className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
            onClick={resetDemoState}
          >
            Reset demo
          </button>
        </div>
      </div>

      {errorText ? (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errorText}
        </div>
      ) : null}

      <BaseTable<ServiceRow>
        data={rows}
        columns={columns}
        isLoading={isLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        queryParams={queryParams}
        sortBy={sortBy}
        sortOrder={sortOrder}
        enableSelection
        onSelectionChange={setSelectedRows}
        onQueryParamsChange={setQueryParams}
        onSortChange={(nextSortBy, nextSortOrder) => {
          setSortBy(nextSortBy);
          setSortOrder(nextSortOrder);
          setQueryParams((previous) => ({
            ...previous,
            page: 1,
          }));
        }}
      />

      <p className="text-xs text-muted-foreground">
        Scenario: {scenario} | Selected rows: {selectedRows.length}
      </p>
    </div>
  );
}

function ButtonPreview(): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        label="Primary"
        variant={ButtonVariant.Primary}
        onClick={() => undefined}
      />
      <Button
        label="Default"
        variant={ButtonVariant.Default}
        onClick={() => undefined}
      />
      <Button
        label="Outlined"
        variant={ButtonVariant.Outlined}
        onClick={() => undefined}
      />
      <Button
        label="Dashed"
        variant={ButtonVariant.Dashed}
        onClick={() => undefined}
      />
      <Button
        label="Left Icon"
        leftIcon={Download}
        variant={ButtonVariant.Text}
        onClick={() => undefined}
      />
      <Button
        label="Right Icon"
        rightIcon={Download}
        variant={ButtonVariant.Outlined}
        onClick={() => undefined}
      />
      <Button
        label="Delete"
        variant={ButtonVariant.Destructive}
        onClick={() => undefined}
      />
    </div>
  );
}

function CheckboxPreview(): JSX.Element {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      name="acceptTerms"
      label="Terms"
      title="I agree to the terms"
      checked={checked}
      onCheckChange={(next) => setChecked(next)}
    />
  );
}

function ChipPreview(): JSX.Element {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button
        label="Reset Chip"
        variant={ButtonVariant.Outlined}
        onClick={() => setVisible(true)}
      />
    );
  }

  return (
    <Chip
      label="Synced"
      icon={Circle}
      variant="secondary"
      size="md"
      onRemove={() => setVisible(false)}
    />
  );
}

function DatePickerPreview(): JSX.Element {
  const [value, setValue] = useState('2026-04-18');

  return (
    <div style={{ maxWidth: 320 }}>
      <DatePicker
        name="startDate"
        label="Start Date"
        value={value}
        helperText="Choose a start date"
        onChange={(change) => {
          setValue(change.target.value ?? '');
        }}
      />
    </div>
  );
}

function DetailsCardPreview(): JSX.Element {
  type UserDetails = {
    id: string;
    email: string;
  };

  return (
    <DetailsCard<UserDetails>
      title="User Details"
      icon={FileText}
      isLoading={false}
      data={{ id: '42', email: 'owner@company.com' }}
      tabs={[
        {
          key: 'profile',
          label: 'Profile',
          component: <div>Profile content</div>,
        },
        {
          key: 'security',
          label: 'Security',
          component: <div>Security content</div>,
        },
      ]}
      onSave={() => undefined}
      onDelete={() => undefined}
      onClose={() => undefined}
      customButtons={[
        {
          label: 'Archive',
          icon: Archive,
          variant: ButtonVariant.Outlined,
          onClick: () => undefined,
        },
      ]}
    />
  );
}

function DropDownPreview(): JSX.Element {
  const [country, setCountry] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <DropDown
        label="Country"
        value={country}
        placeholder="Select country"
        options={[
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
        ]}
        onChange={(next) => setCountry(next)}
      />
    </div>
  );
}

function IconPreview(): JSX.Element {
  return (
    <Icon
      icon={Bell}
      className="h-4 w-4 text-muted-foreground"
      aria-label="Alerts"
    />
  );
}

function ImagePreview(): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <Image src="/tech-icons/shadcnui.svg" alt="Tech logo" size="md" />
      <Image
        src="https://picsum.photos/seed/rapidkit-image-preview/64"
        alt="Remote preview"
        size="md"
      />
    </div>
  );
}

function InputPreview(): JSX.Element {
  const [email, setEmail] = useState('');

  return (
    <div style={{ maxWidth: 360 }}>
      <Input
        name="email"
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name@company.com"
      />
    </div>
  );
}

function TextAreaPreview(): JSX.Element {
  const [notes, setNotes] = useState('');

  return (
    <div style={{ maxWidth: 420 }}>
      <TextArea
        name="notes"
        label="Notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Write implementation notes"
        helperText="Keep this concise and actionable."
      />
    </div>
  );
}

function PagePreview(): JSX.Element {
  return (
    <div>
      <Page
        searchPlaceholder="Search users"
        onSearch={() => undefined}
        actions={[
          {
            name: 'Create User',
            onClick: () => undefined,
            icon: Plus,
            variant: ButtonVariant.Default,
          },
        ]}
        filterSlot={
          <div className="text-xs text-muted-foreground">Active only</div>
        }
      >
        <div className="rounded-md border p-4">Page content</div>
      </Page>
    </div>
  );
}

function SearchPreview(): JSX.Element {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <Search placeholder="Search users" value={value} onChange={setValue} />
    </div>
  );
}

function TextPreview(): JSX.Element {
  return (
    <div style={{ maxWidth: 420 }}>
      <Text as="p" tone="muted" weight="medium">
        Portable component copy that keeps typography consistent across hosts.
      </Text>
    </div>
  );
}

const EXAMPLES: Record<ComponentExampleId, ExampleConfig> = {
  autocomplete: {
    render: AutocompletePreview,
    code: `import { useState } from 'react';
import { Autocomplete } from '@rapidset/rapidkit';

type User = {
  id: number;
  name: string;
  email: string;
};

const searchUsers = async () => ({
  items: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
});
const getUserById = async (): Promise<User | null> => null;

function AssigneeField() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Autocomplete<User>
      name="assignee"
      label="Assignee"
      value={selectedId}
      searchOptions={searchUsers}
      getOptionById={getUserById}
      onSelectOption={(item) => setSelectedId(item?.id ?? null)}
      placeholder="Search teammates"
    />
  );
}`,
  },
  'base-modal': {
    render: BaseModalPreview,
    code: `import { BaseModal, ButtonVariant } from '@rapidset/rapidkit';

<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  description="Update profile settings"
  onSave={() => console.log('save')}
  customButtons={[
    {
      label: 'Preview',
      onClick: () => console.log('preview'),
      variant: ButtonVariant.Outlined,
    },
  ]}
>
  <div className="text-sm text-foreground">Profile form fields go here.</div>
</BaseModal>;`,
  },
  'base-table': {
    render: BaseTablePreview,
    code: `import { useMemo } from 'react';
import { BaseTable } from '@rapidset/rapidkit';
import { CellType } from '@rapidset/rapidkit/base-table';

type ServiceRow = {
  id: number;
  name: string;
  owner: string;
  status: 'active' | 'inactive' | 'degraded';
  alerts: number;
};

export function ServicesTable() {
  const rows: ServiceRow[] = [
    { id: 1, name: 'Payments API', owner: 'Alex Rivera', status: 'active', alerts: 1 },
    { id: 2, name: 'Notification Hub', owner: 'Jordan Kim', status: 'degraded', alerts: 4 },
  ];

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Service',
        accessorKey: 'name',
        type: CellType.TEXT,
        sortable: true,
      },
      { id: 'owner', header: 'Owner', accessorKey: 'owner', type: CellType.AVATAR },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        type: CellType.STATUS,
        sortable: true,
      },
      {
        id: 'alerts',
        header: 'Alerts',
        accessorKey: 'alerts',
        type: CellType.TEXT,
      },
    ],
    [],
  );

  return (
    <BaseTable<ServiceRow> data={rows} columns={columns} enableSelection />
  );
}`,
  },
  button: {
    render: ButtonPreview,
    code: `import { Download } from 'lucide-react';
import { Button, ButtonVariant } from '@rapidset/rapidkit';

<div className="flex flex-wrap items-center gap-2">
  <Button label="Primary" variant={ButtonVariant.Primary} onClick={() => console.log('primary')} />
  <Button label="Default" variant={ButtonVariant.Default} onClick={() => console.log('default')} />
  <Button label="Outlined" variant={ButtonVariant.Outlined} onClick={() => console.log('outlined')} />
  <Button label="Dashed" variant={ButtonVariant.Dashed} onClick={() => console.log('dashed')} />
  <Button label="Left Icon" leftIcon={Download} variant={ButtonVariant.Text} onClick={() => console.log('left icon')} />
  <Button label="Right Icon" rightIcon={Download} variant={ButtonVariant.Outlined} onClick={() => console.log('right icon')} />
  <Button label="Delete" variant={ButtonVariant.Destructive} onClick={() => console.log('delete')} />
</div>;`,
  },
  checkbox: {
    render: CheckboxPreview,
    code: `<Checkbox
  name="acceptTerms"
  label="Terms"
  title="I agree to the terms"
  onCheckChange={(checked) => console.log(checked)}
/>`,
  },
  chip: {
    render: ChipPreview,
    code: `import { Circle } from 'lucide-react';

<Chip
  label="Synced"
  icon={Circle}
  variant="secondary"
  size="md"
  onRemove={() => console.log('remove')}
/>;`,
  },
  'date-picker': {
    render: DatePickerPreview,
    code: `<DatePicker
  name="startDate"
  label="Start Date"
  value="2026-04-18"
  helperText="Choose a start date"
  onChange={(change) => {
    console.log(change.target.name, change.target.value);
  }}
/>`,
  },
  'details-card': {
    render: DetailsCardPreview,
    code: `import { FileText, Archive } from 'lucide-react';
import { ButtonVariant, DetailsCard } from '@rapidset/rapidkit';

interface UserDetails {
  id: string;
  email: string;
}

<DetailsCard<UserDetails>
  title="User Details"
  icon={FileText}
  isLoading={false}
  data={{ id: '42', email: 'owner@company.com' }}
  tabs={[
    { key: 'profile', label: 'Profile', component: <div>Profile content</div> },
    {
      key: 'security',
      label: 'Security',
      component: <div>Security content</div>,
    },
  ]}
  onSave={(data) => console.log('save', data)}
  onDelete={(data) => console.log('delete', data)}
  onClose={() => console.log('close')}
  customButtons={[
    {
      label: 'Archive',
      icon: Archive,
      variant: ButtonVariant.Outlined,
      onClick: (data) => console.log('archive', data),
    },
  ]}
/>;`,
  },
  'drop-down': {
    render: DropDownPreview,
    code: `import { DropDown } from '@rapidset/rapidkit';

<DropDown
  label="Country"
  value=""
  placeholder="Select country"
  options={[
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
  ]}
  onChange={(next) => console.log(next)}
/>;`,
  },
  icon: {
    render: IconPreview,
    code: `import { Bell } from 'lucide-react';

<Icon
  icon={Bell}
  className="h-4 w-4 text-muted-foreground"
  aria-label="Alerts"
/>;`,
  },
  image: {
    render: ImagePreview,
    code: `<div className="flex items-center gap-3">
  <Image src="/tech-icons/shadcnui.svg" alt="Tech logo" size="md" loading="lazy" />
  <Image src="https://picsum.photos/seed/rapidkit-image-preview/64" alt="Remote preview" size="md" loading="lazy" />
</div>`,
  },
  input: {
    render: InputPreview,
    code: `<Input
  name="email"
  label="Email"
  value=""
  onChange={() => {}}
  placeholder="name@company.com"
/>`,
  },
  page: {
    render: PagePreview,
    code: `import { Plus } from 'lucide-react';
import { ButtonVariant, Page } from '@rapidset/rapidkit';

<Page
  searchPlaceholder="Search users"
  onSearch={(value) => console.log(value)}
  actions={[
    {
      name: 'Create User',
      onClick: () => console.log('create'),
      icon: Plus,
      variant: ButtonVariant.Default,
    },
  ]}
  filterSlot={<div className="text-xs text-muted-foreground">Active only</div>}
>
  <div className="rounded-md border p-4">Page content</div>
</Page>;`,
  },
  search: {
    render: SearchPreview,
    code: `import { Search } from '@rapidset/rapidkit';

<Search placeholder="Search users" onChange={(value) => console.log(value)} />;`,
  },
  text: {
    render: TextPreview,
    code: `<Text as="p" tone="muted" weight="medium">
  Portable component copy that keeps typography consistent across hosts.
</Text>`,
  },
  'text-area': {
    render: TextAreaPreview,
    code: `<TextArea
  name="notes"
  label="Notes"
  value=""
  onChange={() => {}}
  placeholder="Write implementation notes"
  helperText="Keep this concise and actionable."
/>`,
  },
};

function ExampleTabsContent({ component }: ExampleTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');
  const [highlightedCodeHtml, setHighlightedCodeHtml] = useState('');

  const example = useMemo(() => EXAMPLES[component], [component]);
  const Preview = example.render;
  const previewPanelId = `${component}-preview-panel`;
  const codePanelId = `${component}-code-panel`;
  const previewTabId = `${component}-preview-tab`;
  const codeTabId = `${component}-code-tab`;

  useEffect(() => {
    let isCancelled = false;

    async function highlightCode(): Promise<void> {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(example.code, {
          lang: 'tsx',
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        if (!isCancelled) {
          setHighlightedCodeHtml(html);
        }
      } catch {
        if (!isCancelled) {
          setHighlightedCodeHtml('');
        }
      }
    }

    if (activeTab === 'code') {
      void highlightCode();
    }

    return () => {
      isCancelled = true;
    };
  }, [activeTab, example.code]);

  async function copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopyState('done');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => {
      setCopyState('idle');
    }, 1500);
  }

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
          <div
            className={`component-example-tabs__preview component-example-tabs__preview--${component}`}
          >
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
          <div className="component-example-tabs__code-viewer">
            <button
              type="button"
              className="component-example-tabs__copy-btn"
              onClick={copyCode}
              aria-label="Copy code snippet"
            >
              {getCopyLabel(copyState)}
            </button>

            <div className="component-example-tabs__code-scroll component-example-tabs__code-block">
              {highlightedCodeHtml ? (
                <div
                  className="component-example-tabs__shiki"
                  dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
                />
              ) : (
                <pre>
                  <code>{example.code}</code>
                </pre>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ComponentExampleTabs({
  component,
}: ExampleTabsProps): JSX.Element {
  return <ExampleTabsContent component={component} />;
}
