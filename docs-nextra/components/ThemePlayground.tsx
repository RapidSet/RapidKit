import { useEffect, useState } from 'react';
import { Autocomplete } from '../../src/components/Autocomplete';
import {
  BaseTable,
  type BaseTableQueryParams,
  type BaseTableSortOrder,
  type Column,
} from '../../src/components/BaseTable';
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
import { Label } from '../../src/components/ui/label';
import { Bell, Layers3, Palette } from 'lucide-react';
import { CellType } from '../../src/components/BaseTable/components/BaseTableRow/components/BaseTableCell/types';
import {
  THEME_CHANGE_EVENT,
  THEME_OPTIONS,
  type BuiltInThemeId,
  initializeDocsTheme,
  setDocsTheme,
} from './docsTheme';

const TOKEN_SWATCHES: Array<{ label: string; token: string }> = [
  { label: 'Background', token: '--mz-background' },
  { label: 'Foreground', token: '--mz-foreground' },
  { label: 'Primary', token: '--mz-primary' },
  { label: 'Secondary', token: '--mz-secondary' },
  { label: 'Muted', token: '--mz-muted' },
  { label: 'Accent', token: '--mz-accent' },
  { label: 'Destructive', token: '--mz-destructive' },
  { label: 'Border', token: '--mz-border' },
];

type PreviewAssignee = {
  id: number;
  name: string;
  role: string;
};

type PreviewServiceRow = {
  id: number;
  name: string;
  owner: string;
  status: 'active' | 'degraded' | 'planned';
  region: string;
  createdAt: string;
  alerts: number;
  compliant: boolean;
  tags: string[];
};

const PREVIEW_ASSIGNEES: PreviewAssignee[] = [
  { id: 1, name: 'Avery Stone', role: 'Design Systems' },
  { id: 2, name: 'Mina Patel', role: 'Platform' },
  { id: 3, name: 'Jordan Kim', role: 'Frontend' },
  { id: 4, name: 'Riley Chen', role: 'Developer Experience' },
  { id: 5, name: 'Noah Silva', role: 'Accessibility' },
];

const PREVIEW_TABLE_COLUMNS: Column<PreviewServiceRow>[] = [
  {
    id: 'name',
    header: 'Service',
    accessorKey: 'name',
    type: CellType.TEXT,
    sortable: true,
    isInactive: (_value, item) => item.status === 'planned',
  },
  {
    id: 'owner',
    header: 'Owner',
    accessorKey: 'owner',
    type: CellType.TEXT,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    type: CellType.STATUS,
    sortable: true,
  },
  {
    id: 'region',
    header: 'Region',
    accessorKey: 'region',
    type: CellType.CHIP,
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessorKey: 'createdAt',
    type: CellType.DATE,
    sortable: true,
  },
  {
    id: 'alerts',
    header: 'Alerts',
    accessorKey: 'alerts',
    type: CellType.ICON,
    iconNameMapper: (value) => {
      if (typeof value !== 'number') {
        return 'ShieldCheck';
      }

      if (value > 4) {
        return 'AlertTriangle';
      }

      return value > 0 ? 'TriangleAlert' : 'ShieldCheck';
    },
  },
  {
    id: 'compliant',
    header: 'Compliant',
    accessorKey: 'compliant',
    type: CellType.BOOLEAN,
  },
  {
    id: 'tags',
    header: 'Tags',
    accessorKey: 'tags',
    type: CellType.MULTI_STATUS,
  },
  {
    id: 'actions',
    header: 'Actions',
    type: CellType.ACTIONS,
    actions: [
      {
        label: 'Open',
        iconName: 'Search',
        variant: 'primary',
        onClick: () => {},
      },
      {
        label: 'Approve',
        iconName: 'ShieldCheck',
        variant: 'success',
        onClick: () => {},
      },
      {
        label: 'Review',
        iconName: 'TriangleAlert',
        variant: 'warning',
        onClick: () => {},
      },
      {
        label: 'Archive',
        iconName: 'Trash2',
        variant: 'danger',
        onClick: () => {},
      },
    ],
  },
];

const PREVIEW_TABLE_ROWS: PreviewServiceRow[] = [
  {
    id: 1,
    name: 'Component Registry',
    owner: 'Platform',
    status: 'active',
    region: 'US East',
    createdAt: '2026-02-12',
    alerts: 0,
    compliant: true,
    tags: ['stable', 'core'],
  },
  {
    id: 2,
    name: 'Theme Tokens API',
    owner: 'Design Ops',
    status: 'active',
    region: 'EU West',
    createdAt: '2026-03-03',
    alerts: 1,
    compliant: true,
    tags: ['tokens', 'governed'],
  },
  {
    id: 3,
    name: 'Docs Preview Worker',
    owner: 'Frontend',
    status: 'degraded',
    region: 'US West',
    createdAt: '2026-01-25',
    alerts: 5,
    compliant: false,
    tags: ['preview', 'triage'],
  },
  {
    id: 4,
    name: 'Release Pipelines',
    owner: 'Developer Experience',
    status: 'planned',
    region: 'Global',
    createdAt: '2026-04-02',
    alerts: 0,
    compliant: false,
    tags: ['planned', 'automation'],
  },
  {
    id: 5,
    name: 'Package Insights',
    owner: 'Analytics',
    status: 'active',
    region: 'AP South',
    createdAt: '2026-02-28',
    alerts: 2,
    compliant: true,
    tags: ['observability', 'metrics'],
  },
];

const PREVIEW_TABLE_DEFAULT_QUERY: BaseTableQueryParams = {
  query: '',
  page: 1,
  size: 2,
};

const PREVIEW_DETAILS_TABS = [
  {
    key: 'overview',
    label: 'Overview',
    component: (
      <div className="mz-preview-card__details-panel">
        <div className="mz-preview-card__details-metrics">
          <div className="mz-preview-card__details-metric">
            <span className="mz-preview-card__details-metric-label">
              Package Health
            </span>
            <strong className="mz-preview-card__details-metric-value">
              98%
            </strong>
          </div>
          <div className="mz-preview-card__details-metric">
            <span className="mz-preview-card__details-metric-label">
              Active Themes
            </span>
            <strong className="mz-preview-card__details-metric-value">8</strong>
          </div>
          <div className="mz-preview-card__details-metric">
            <span className="mz-preview-card__details-metric-label">
              Weekly Publish
            </span>
            <strong className="mz-preview-card__details-metric-value">
              12
            </strong>
          </div>
        </div>
        <p className="mz-preview-card__details-copy">
          Preview richer surfaces like tab framing, separators, button actions,
          and scrollable content under each theme token set.
        </p>
      </div>
    ),
  },
  {
    key: 'activity',
    label: 'Activity',
    component: (
      <div className="mz-preview-card__details-panel mz-preview-card__details-panel--list">
        <div className="mz-preview-card__details-list-item">
          <span className="mz-preview-card__details-list-title">
            Tokens synced
          </span>
          <span className="mz-preview-card__details-list-meta">
            2 minutes ago
          </span>
        </div>
        <div className="mz-preview-card__details-list-item">
          <span className="mz-preview-card__details-list-title">
            Docs build passed
          </span>
          <span className="mz-preview-card__details-list-meta">
            7 minutes ago
          </span>
        </div>
        <div className="mz-preview-card__details-list-item">
          <span className="mz-preview-card__details-list-title">
            Theme updated
          </span>
          <span className="mz-preview-card__details-list-meta">Today</span>
        </div>
      </div>
    ),
  },
] as const;

async function searchPreviewAssignees(params: {
  query: string;
  page: number;
  size: number;
}) {
  const query = params.query.trim().toLowerCase();
  const filteredItems = PREVIEW_ASSIGNEES.filter((item) => {
    if (!query) {
      return true;
    }

    return `${item.name} ${item.role}`.toLowerCase().includes(query);
  });

  const startIndex = (params.page - 1) * params.size;
  const items = filteredItems.slice(startIndex, startIndex + params.size);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / params.size));

  return {
    items,
    currentPage: params.page,
    totalPages,
    totalItems: filteredItems.length,
  };
}

async function getPreviewAssigneeById(id: number) {
  return PREVIEW_ASSIGNEES.find((item) => item.id === id) ?? null;
}

type PreviewCardProps = Readonly<{
  email: string;
  searchValue: string;
  pageSearchValue: string;
  startDate: string;
  selectedCountry: string;
  selectedAssigneeId: number | null;
  acceptedTerms: boolean;
  tableQueryParams: BaseTableQueryParams;
  tableSortBy?: string;
  tableSortOrder?: BaseTableSortOrder;
  onEmailChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onPageSearchChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onSelectedCountryChange: (value: string) => void;
  onSelectedAssigneeChange: (value: number | null) => void;
  onAcceptedTermsChange: (value: boolean) => void;
  onTableQueryParamsChange: (value: BaseTableQueryParams) => void;
  onTableSortChange: (sortBy: string, sortOrder: BaseTableSortOrder) => void;
}>;

function PreviewCard(props: PreviewCardProps) {
  const {
    email,
    searchValue,
    pageSearchValue,
    startDate,
    selectedCountry,
    selectedAssigneeId,
    acceptedTerms,
    tableQueryParams,
    tableSortBy,
    tableSortOrder,
    onEmailChange,
    onSearchChange,
    onPageSearchChange,
    onStartDateChange,
    onSelectedCountryChange,
    onSelectedAssigneeChange,
    onAcceptedTermsChange,
    onTableQueryParamsChange,
    onTableSortChange,
  } = props;

  const sortedTableRows = [...PREVIEW_TABLE_ROWS].sort((left, right) => {
    if (!tableSortBy) {
      return 0;
    }

    const leftValue = String(
      left[tableSortBy as keyof PreviewServiceRow] ?? '',
    );
    const rightValue = String(
      right[tableSortBy as keyof PreviewServiceRow] ?? '',
    );
    const result = leftValue.localeCompare(rightValue);

    return tableSortOrder === 'desc' ? result * -1 : result;
  });

  const startIndex = (tableQueryParams.page - 1) * tableQueryParams.size;
  const pagedTableRows = sortedTableRows.slice(
    startIndex,
    startIndex + tableQueryParams.size,
  );
  const previewTableTotalPages = Math.max(
    1,
    Math.ceil(sortedTableRows.length / tableQueryParams.size),
  );

  return (
    <article className="mz-preview-card">
      <div className="mz-preview-card__surface">
        <div className="mz-preview-card__head">
          <div>
            <h4 className="mz-preview-card__title">Preview Surface</h4>
          </div>
        </div>

        <div className="mz-preview-card__stack">
          <section className="mz-preview-card__section">
            <div className="mz-preview-card__section-head">
              <h5 className="mz-preview-card__section-title">Inputs</h5>
            </div>
            <div className="mz-preview-card__component-grid">
              <div className="mz-preview-card__component-item">
                <Input
                  name="theme-preview-email"
                  label="Email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                />
              </div>

              <div className="mz-preview-card__component-item">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Search
                  </Label>
                  <Search
                    ariaLabel="theme-preview-search"
                    placeholder="Search components"
                    value={searchValue}
                    onChange={onSearchChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mz-preview-card__component-item">
                <DatePicker
                  name="theme-preview-date"
                  label="Start Date"
                  value={startDate}
                  onChange={(change) =>
                    onStartDateChange(change.target.value ?? '')
                  }
                />
              </div>

              <div className="mz-preview-card__component-item">
                <DropDown
                  label="Country"
                  value={selectedCountry}
                  placeholder="Select country"
                  options={[
                    { label: 'United States', value: 'US' },
                    { label: 'Canada', value: 'CA' },
                    { label: 'Germany', value: 'DE' },
                  ]}
                  onChange={onSelectedCountryChange}
                />
              </div>

              <div className="mz-preview-card__component-item mz-preview-card__component-item--full">
                <Autocomplete<PreviewAssignee>
                  name="theme-preview-assignee"
                  label="Assignee"
                  placeholder="Search teammates"
                  value={selectedAssigneeId}
                  onSelectOption={(item) =>
                    onSelectedAssigneeChange(item?.id ?? null)
                  }
                  searchOptions={searchPreviewAssignees}
                  getOptionById={getPreviewAssigneeById}
                  getOptionLabel={(item) => item.name}
                  renderOption={(item) => (
                    <span className="mz-preview-card__autocomplete-option">
                      <span className="mz-preview-card__autocomplete-name">
                        {item.name}
                      </span>
                      <span className="mz-preview-card__autocomplete-meta">
                        {item.role}
                      </span>
                    </span>
                  )}
                />
              </div>
            </div>
          </section>

          <section className="mz-preview-card__section">
            <div className="mz-preview-card__section-head">
              <h5 className="mz-preview-card__section-title">Actions</h5>
            </div>

            <div className="mz-preview-card__component-row">
              <Checkbox
                name="theme-preview-terms"
                label="Terms"
                title="I agree to the terms"
                checked={acceptedTerms}
                onCheckChange={onAcceptedTermsChange}
              />
            </div>

            <div className="mz-preview-card__actions">
              <Button
                label="Primary"
                variant={ButtonVariant.Primary}
                className="w-full"
              />
              <Button
                label="Secondary"
                variant={ButtonVariant.Outlined}
                className="w-full"
              />
              <Button
                label="Tertiary"
                variant={ButtonVariant.Dashed}
                className="w-full"
              />
            </div>

            <div className="mz-preview-card__chips">
              <Chip label="UI" />
              <Chip label="Theme" />
              <Chip label="Preview" />
              <Icon
                icon={Bell}
                className="h-4 w-4 text-muted-foreground"
                aria-label="Alerts"
              />
              <Image src="/tech-icons/shadcnui.svg" alt="Tech logo" size="sm" />
            </div>
          </section>

          <section className="mz-preview-card__section">
            <div className="mz-preview-card__section-head">
              <h5 className="mz-preview-card__section-title">Data</h5>
            </div>

            <div className="mz-preview-card__table-wrap">
              <BaseTable<PreviewServiceRow>
                data={pagedTableRows}
                columns={PREVIEW_TABLE_COLUMNS}
                totalItems={sortedTableRows.length}
                totalPages={previewTableTotalPages}
                queryParams={tableQueryParams}
                onQueryParamsChange={onTableQueryParamsChange}
                sortBy={tableSortBy}
                sortOrder={tableSortOrder}
                onSortChange={onTableSortChange}
                enableSelection
                className="mz-preview-card__table"
              />
            </div>
          </section>

          <section className="mz-preview-card__section">
            <div className="mz-preview-card__section-head">
              <h5 className="mz-preview-card__section-title">Surface</h5>
            </div>

            <div className="mz-preview-card__details-wrap">
              <DetailsCard
                title="Release Summary"
                icon={Layers3}
                isLoading={false}
                tabs={[...PREVIEW_DETAILS_TABS]}
                customButtons={[
                  {
                    label: 'Sync',
                    onClick: () => {},
                    variant: ButtonVariant.Outlined,
                  },
                ]}
                renderCustomContent={() => (
                  <div className="mz-preview-card__details-banner">
                    <span className="mz-preview-card__details-banner-label">
                      Latest
                    </span>
                    <span className="mz-preview-card__details-banner-text">
                      Theme tokens are in sync across docs, package CSS, and
                      preview.
                    </span>
                  </div>
                )}
              />
            </div>
          </section>

          <section className="mz-preview-card__section">
            <div className="mz-preview-card__section-head">
              <h5 className="mz-preview-card__section-title">Layout</h5>
            </div>

            <div className="mz-preview-card__page-wrap">
              <Page
                className="mz-preview-card__page"
                onSearch={onPageSearchChange}
                searchPlaceholder="Search releases"
                filterSlot={
                  <span className="mz-preview-card__page-filter">
                    All teams
                  </span>
                }
                actions={[
                  {
                    name: 'Publish',
                    onClick: () => {},
                    variant: ButtonVariant.Primary,
                  },
                  {
                    name: 'Export',
                    onClick: () => {},
                    variant: ButtonVariant.Outlined,
                  },
                ]}
              >
                <div className="mz-preview-card__page-body">
                  <div className="mz-preview-card__page-metrics">
                    <div className="mz-preview-card__page-panel">
                      <span className="mz-preview-card__page-panel-label">
                        Active query
                      </span>
                      <strong className="mz-preview-card__page-panel-value">
                        {pageSearchValue || 'No search applied'}
                      </strong>
                    </div>
                    <div className="mz-preview-card__page-panel">
                      <span className="mz-preview-card__page-panel-label">
                        Ready to publish
                      </span>
                      <strong className="mz-preview-card__page-panel-value">
                        24 components
                      </strong>
                    </div>
                  </div>

                  <div className="mz-preview-card__page-feed">
                    <div className="mz-preview-card__page-feed-item">
                      <span className="mz-preview-card__page-feed-title">
                        Token audit finished
                      </span>
                      <span className="mz-preview-card__page-feed-meta">
                        8 themes checked
                      </span>
                    </div>
                    <div className="mz-preview-card__page-feed-item">
                      <span className="mz-preview-card__page-feed-title">
                        Preview snapshots updated
                      </span>
                      <span className="mz-preview-card__page-feed-meta">
                        Build artifacts refreshed
                      </span>
                    </div>
                    <div className="mz-preview-card__page-feed-item">
                      <span className="mz-preview-card__page-feed-title">
                        Release notes drafted
                      </span>
                      <span className="mz-preview-card__page-feed-meta">
                        Awaiting approval
                      </span>
                    </div>
                  </div>
                </div>
              </Page>
            </div>
          </section>

          <section className="mz-preview-card__section">
            <div className="mz-preview-card__section-head">
              <h5 className="mz-preview-card__section-title">Tokens</h5>
            </div>

            <div
              className="mz-preview-card__token-grid"
              aria-label="Token swatches"
            >
              {TOKEN_SWATCHES.map((swatch) => (
                <span key={swatch.token} className="mz-token-item">
                  <span
                    className="mz-token-item__dot"
                    style={{ backgroundColor: `hsl(var(${swatch.token}))` }}
                    aria-hidden="true"
                  />
                  <span className="mz-token-item__label">{swatch.label}</span>
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

export function ThemePlayground() {
  const [theme, setTheme] = useState<BuiltInThemeId>('default');
  const [email, setEmail] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [pageSearchValue, setPageSearchValue] = useState('Theme');
  const [startDate, setStartDate] = useState('2026-04-19');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | null>(
    2,
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [tableQueryParams, setTableQueryParams] = useState(
    PREVIEW_TABLE_DEFAULT_QUERY,
  );
  const [tableSortBy, setTableSortBy] = useState<string | undefined>('name');
  const [tableSortOrder, setTableSortOrder] = useState<
    BaseTableSortOrder | undefined
  >('asc');

  useEffect(() => {
    setTheme(initializeDocsTheme());

    const handleThemeChange = (event: Event) => {
      setTheme((event as CustomEvent<BuiltInThemeId>).detail);
    };

    globalThis.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      globalThis.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  return (
    <section className="mz-theme-playground" aria-label="Theme playground">
      <header className="mz-theme-playground__header">
        <div className="mz-theme-playground__selector-row">
          <div className="mz-theme-control">
            <DropDown
              value={theme}
              onChange={(nextTheme) =>
                setDocsTheme(nextTheme as BuiltInThemeId)
              }
              options={THEME_OPTIONS.map((option) => ({
                label: option.label,
                value: option.id,
              }))}
              placeholder="Theme"
              className="mz-theme-dropdown"
              renderOption={(option) => (
                <span className="mz-theme-option-label">
                  <Icon
                    icon={Palette}
                    className="mz-theme-option-icon"
                    aria-hidden="true"
                  />
                  {option.label}
                </span>
              )}
            />
          </div>
        </div>
      </header>

      <div className="mz-theme-playground__preview-grid">
        <PreviewCard
          email={email}
          searchValue={searchValue}
          pageSearchValue={pageSearchValue}
          startDate={startDate}
          selectedCountry={selectedCountry}
          selectedAssigneeId={selectedAssigneeId}
          acceptedTerms={acceptedTerms}
          tableQueryParams={tableQueryParams}
          tableSortBy={tableSortBy}
          tableSortOrder={tableSortOrder}
          onEmailChange={setEmail}
          onSearchChange={setSearchValue}
          onPageSearchChange={setPageSearchValue}
          onStartDateChange={setStartDate}
          onSelectedCountryChange={setSelectedCountry}
          onSelectedAssigneeChange={setSelectedAssigneeId}
          onAcceptedTermsChange={setAcceptedTerms}
          onTableQueryParamsChange={setTableQueryParams}
          onTableSortChange={(nextSortBy, nextSortOrder) => {
            setTableSortBy(nextSortBy);
            setTableSortOrder(nextSortOrder);
            setTableQueryParams((previous) => ({ ...previous, page: 1 }));
          }}
        />
      </div>
    </section>
  );
}
