import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PageHeader } from './PageHeader';
import { ButtonVariant } from '@components/Button/styles';
import type { LucideIcon } from 'lucide-react';

interface MockButtonProps {
  onClick?: () => void;
  label: string;
  disabled?: boolean;
  variant?: string;
  leftIcon?: unknown;
  access?: { rules: Array<{ action: string; subject: string }> };
}

interface MockSearchProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

vi.mock('@components/Button', () => ({
  Button: ({
    onClick,
    label,
    disabled,
    variant,
    leftIcon,
    access,
  }: MockButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={`action-${label}`}
      data-variant={variant || ''}
      data-has-icon={String(Boolean(leftIcon))}
      data-access-rules={(access?.rules || [])
        .map((rule) => `${rule.subject}.${rule.action}`)
        .join(',')}
    >
      {label}
    </button>
  ),
}));

vi.mock('@components/Search', () => ({
  Search: ({ placeholder, onChange }: MockSearchProps) => (
    <input
      aria-label="search-input"
      placeholder={placeholder}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
}));

describe('PageHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders default search input and filter slot', () => {
    render(<PageHeader filterSlot={<div>Filters</div>} />);

    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
    expect(screen.getByText('Filters')).toBeTruthy();
  });

  it('uses provided search placeholder and calls onSearch on input change', () => {
    const onSearch = vi.fn();

    render(
      <PageHeader onSearch={onSearch} searchPlaceholder="Search projects" />,
    );

    fireEvent.change(screen.getByLabelText('search-input'), {
      target: { value: 'alpha' },
    });

    expect(screen.getByPlaceholderText('Search projects')).toBeTruthy();
    expect(onSearch).toHaveBeenCalledWith('alpha');
  });

  it('renders action buttons and triggers click handlers', () => {
    const createClick = vi.fn();
    const exportClick = vi.fn();
    const FakeIcon = vi.fn() as unknown as LucideIcon;

    render(
      <PageHeader
        actions={[
          {
            name: 'Create',
            onClick: createClick,
            variant: ButtonVariant.Default,
            access: { rules: [{ action: 'create', subject: 'project' }] },
          },
          {
            name: 'Export',
            onClick: exportClick,
            variant: ButtonVariant.Outlined,
            icon: FakeIcon,
            disabled: true,
          },
        ]}
      />,
    );

    const createButton = screen.getByTestId('action-Create');
    const exportButton = screen.getByTestId('action-Export');

    expect((createButton as HTMLButtonElement).dataset.variant).toBe('default');
    expect((createButton as HTMLButtonElement).dataset.accessRules).toBe(
      'project.create',
    );
    expect((exportButton as HTMLButtonElement).dataset.variant).toBe(
      'outlined',
    );
    expect((exportButton as HTMLButtonElement).dataset.hasIcon).toBe('true');
    expect((exportButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(createButton);
    expect(createClick).toHaveBeenCalledTimes(1);
    expect(exportClick).not.toHaveBeenCalled();
  });
});
