import { useEffect, useState } from 'react';
import {
  Autocomplete,
  BaseTable,
  type BaseTableQueryParams,
  type BaseTableSortOrder,
  Button,
  ButtonVariant,
  Checkbox,
  type Column,
  Chip,
  DatePicker,
  DetailsCard,
  DropDown,
  Icon,
  Image,
  Input,
  Page,
  Search,
} from '../../../../src';
import { Bell, Layers3 } from 'lucide-react';
import { CellType } from '../../../../src/components/BaseTable/components/BaseTableRow/components/BaseTableCell/types';
import './ThemePlayground.css';

type BuiltInThemeId =
  | 'corporate'
  | 'default'
  | 'forest'
  | 'midnight'
  | 'ocean'
  | 'sand'
  | 'slate'
  | 'sunset';

type ThemeOption = {
  id: BuiltInThemeId;
  label: string;
  note: string;
  light: {
    primary: string;
    accent: string;
    surface: string;
  };
  dark: {
    primary: string;
    accent: string;
    surface: string;
  };
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    label: 'Default',
    note: 'shadcn baseline',
    light: {
      primary: 'hsl(221.2 83.2% 53.3%)',
      accent: 'hsl(210 40% 96.1%)',
      surface: 'hsl(0 0% 100%)',
    },
    dark: {
      primary: 'hsl(217.2 91.2% 59.8%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      surface: 'hsl(222.2 84% 4.9%)',
    },
  },
  {
    id: 'corporate',
    label: 'Corporate',
    note: 'enterprise tone',
    light: {
      primary: 'hsl(221 65% 35%)',
      accent: 'hsl(199 72% 45%)',
      surface: 'hsl(210 33% 98%)',
    },
    dark: {
      primary: 'hsl(210 92% 73%)',
      accent: 'hsl(198 70% 52%)',
      surface: 'hsl(222 39% 11%)',
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    note: 'organic contrast',
    light: {
      primary: 'hsl(142 58% 33%)',
      accent: 'hsl(88 45% 48%)',
      surface: 'hsl(114 38% 97%)',
    },
    dark: {
      primary: 'hsl(141 50% 58%)',
      accent: 'hsl(88 38% 45%)',
      surface: 'hsl(128 30% 9%)',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    note: 'high contrast cool',
    light: {
      primary: 'hsl(245 75% 58%)',
      accent: 'hsl(278 68% 58%)',
      surface: 'hsl(228 34% 96%)',
    },
    dark: {
      primary: 'hsl(246 86% 70%)',
      accent: 'hsl(278 67% 63%)',
      surface: 'hsl(232 35% 8%)',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    note: 'clean and vibrant',
    light: {
      primary: 'hsl(200 88% 42%)',
      accent: 'hsl(174 54% 47%)',
      surface: 'hsl(196 55% 97%)',
    },
    dark: {
      primary: 'hsl(197 88% 60%)',
      accent: 'hsl(173 48% 39%)',
      surface: 'hsl(208 53% 9%)',
    },
  },
  {
    id: 'sand',
    label: 'Sand',
    note: 'warm palette',
    light: {
      primary: 'hsl(28 74% 46%)',
      accent: 'hsl(16 66% 56%)',
      surface: 'hsl(42 56% 97%)',
    },
    dark: {
      primary: 'hsl(30 82% 63%)',
      accent: 'hsl(16 66% 58%)',
      surface: 'hsl(30 25% 10%)',
    },
  },
  {
    id: 'slate',
    label: 'Slate',
    note: 'neutral utility',
    light: {
      primary: 'hsl(215 27.9% 16.9%)',
      accent: 'hsl(214 32% 91%)',
      surface: 'hsl(210 40% 98%)',
    },
    dark: {
      primary: 'hsl(210 40% 98%)',
      accent: 'hsl(217.2 32.6% 20%)',
      surface: 'hsl(222.2 47.4% 8.5%)',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    note: 'expressive blend',
    light: {
      primary: 'hsl(17 84% 54%)',
      accent: 'hsl(335 74% 58%)',
      surface: 'hsl(28 70% 97%)',
    },
    dark: {
      primary: 'hsl(20 90% 63%)',
      accent: 'hsl(336 64% 60%)',
      surface: 'hsl(14 30% 10%)',
    },
  },
];

const THEME_STORAGE_KEY = 'mezmer-docs-theme';
const THEME_STYLE_ID = 'mezmer-docs-theme-style-scoped';
const LEGACY_GLOBAL_THEME_LINK_ID = 'mezmer-docs-theme-stylesheet';
const THEME_SCOPE_SELECTOR = '.mz-theme-playground';
const LEGACY_PREVIEW_THEME_STYLESHEET_ID =
  'mezmer-docs-component-preview-theme';

function getThemeStylesheetHref(theme: BuiltInThemeId): string {
  const basePath =
    (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env
      ?.BASE_URL || '/';
  return `${basePath}themes/${theme}.css`;
}

async function ensureThemeStylesheet(theme: BuiltInThemeId): Promise<void> {
  const href = getThemeStylesheetHref(theme);
  const response = await fetch(href);
  if (!response.ok) {
    return;
  }

  const cssText = await response.text();
  const scopedCss = cssText
    .replaceAll(/(^|\})\s*:root\s*\{/g, `$1\n${THEME_SCOPE_SELECTOR} {`)
    .replaceAll(/(^|\})\s*\.dark\s*\{/g, `$1\n.dark ${THEME_SCOPE_SELECTOR} {`);

  let styleTag = document.getElementById(
    THEME_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = THEME_STYLE_ID;
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = scopedCss;
}

function resolveInitialTheme(): BuiltInThemeId {
  const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
  const resolved = THEME_OPTIONS.find((option) => option.id === stored);

  if (resolved) {
    return resolved.id;
  }

  return 'default';
}

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
  },
  {
    id: 'region',
    header: 'Region',
    accessorKey: 'region',
    type: CellType.CHIP,
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
  },
  {
    id: 2,
    name: 'Theme Tokens API',
    owner: 'Design Ops',
    status: 'active',
    region: 'EU West',
  },
  {
    id: 3,
    name: 'Docs Preview Worker',
    owner: 'Frontend',
    status: 'degraded',
    region: 'US West',
  },
  {
    id: 4,
    name: 'Release Pipelines',
    owner: 'Developer Experience',
    status: 'planned',
    region: 'Global',
  },
  {
    id: 5,
    name: 'Package Insights',
    owner: 'Analytics',
    status: 'active',
    region: 'AP South',
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
                <div className="mz-preview-card__field">
                  <span className="mz-preview-card__field-label">Search</span>
                  <Search
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
    setTheme(resolveInitialTheme());

    const legacyPreviewStylesheet = document.getElementById(
      LEGACY_PREVIEW_THEME_STYLESHEET_ID,
    );

    if (legacyPreviewStylesheet) {
      legacyPreviewStylesheet.remove();
    }

    const legacyGlobalThemeLink = document.getElementById(
      LEGACY_GLOBAL_THEME_LINK_ID,
    );

    if (legacyGlobalThemeLink) {
      legacyGlobalThemeLink.remove();
    }
  }, []);

  useEffect(() => {
    void ensureThemeStylesheet(theme);
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <section className="mz-theme-playground" aria-label="Theme playground">
      <header className="mz-theme-playground__header">
        <div className="mz-theme-playground__selector-row">
          <label
            htmlFor="theme-selector"
            className="mz-theme-playground__selector-label"
          >
            Theme
          </label>
          <select
            id="theme-selector"
            className="mz-theme-playground__selector"
            value={theme}
            onChange={(event) => setTheme(event.target.value as BuiltInThemeId)}
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
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
