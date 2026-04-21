import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PAGINATION_PARAM } from '@lib/pagination';
import { Autocomplete } from './Autocomplete';
import type { AutocompleteProps } from './types';

interface TestItem {
  id: number;
  name: string;
}

const expectedSize = DEFAULT_PAGINATION_PARAM.size ?? 10;

const makeSearchResult = (items: TestItem[]) => ({
  items,
  currentPage: 1,
  totalPages: 1,
  totalItems: items.length,
});

let canView = true;
let canEdit = true;

const resolveAccess = vi.fn((_: string, mode: 'view' | 'edit') =>
  mode === 'view' ? canView : canEdit,
);

const renderAutocomplete = (
  overrides: Partial<AutocompleteProps<TestItem>> = {},
) => {
  const searchOptions = vi
    .fn()
    .mockResolvedValue(makeSearchResult([{ id: 1, name: 'Alpha' }]));

  const defaultProps: AutocompleteProps<TestItem> = {
    name: 'resource',
    value: null,
    label: 'Resource',
    placeholder: 'Search resource',
    searchOptions,
    onSelectOption: vi.fn(),
  };

  const renderResult = render(
    <Autocomplete<TestItem> {...defaultProps} {...overrides} />,
  );

  return {
    container: renderResult.container,
    searchOptions,
    onSelectOption:
      (overrides.onSelectOption as AutocompleteProps<TestItem>['onSelectOption']) ||
      defaultProps.onSelectOption,
  };
};

describe('Autocomplete', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canEdit = true;
    resolveAccess.mockClear();
  });

  it('loads selected item by id and displays it', async () => {
    const triggerGetById = vi.fn().mockResolvedValue({ id: 2, name: 'Beta' });

    const { container } = renderAutocomplete({
      value: 2,
      getOptionById: triggerGetById,
    });

    await waitFor(() => {
      expect(triggerGetById).toHaveBeenCalledWith(2);
    });

    expect(within(container).getByLabelText('Resource')).toHaveProperty(
      'value',
      'Beta',
    );
  });

  it('searches when typing and renders options', async () => {
    const searchOptions = vi.fn().mockResolvedValue(
      makeSearchResult([
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Alpine' },
      ]),
    );

    const { container } = renderAutocomplete({ searchOptions });

    fireEvent.change(within(container).getByLabelText('Resource'), {
      target: { value: 'al' },
    });

    await waitFor(() => {
      expect(searchOptions).toHaveBeenCalledWith({
        query: 'al',
        page: 1,
        size: expectedSize,
      });
    });

    expect(await within(container).findByText('Alpha')).toBeTruthy();
    expect(await within(container).findByText('Alpine')).toBeTruthy();

    const separatorContainer = container.querySelector('.divide-y');
    expect(separatorContainer).toBeTruthy();
  });

  it('selects an option and calls onSelectOption', async () => {
    const selected = { id: 3, name: 'Gamma' };
    const onSelectOption = vi.fn();
    const searchOptions = vi
      .fn()
      .mockResolvedValue(makeSearchResult([selected]));

    const { container } = renderAutocomplete({ searchOptions, onSelectOption });

    fireEvent.change(within(container).getByLabelText('Resource'), {
      target: { value: 'ga' },
    });

    fireEvent.click(await within(container).findByText('Gamma'));

    expect(onSelectOption).toHaveBeenCalledTimes(1);
    expect(onSelectOption).toHaveBeenCalledWith(selected);
  });

  it('shows empty state when no search results are found', async () => {
    const searchOptions = vi.fn().mockResolvedValue(makeSearchResult([]));

    const { container } = renderAutocomplete({ searchOptions });

    fireEvent.change(within(container).getByLabelText('Resource'), {
      target: { value: 'zzz' },
    });

    expect(await within(container).findByText('No results found')).toBeTruthy();
  });

  it('loads next page when scrolled near the bottom', async () => {
    const searchOptions = vi
      .fn()
      .mockResolvedValueOnce({
        items: [{ id: 1, name: 'Alpha' }],
        currentPage: 1,
        totalPages: 2,
        totalItems: 2,
      })
      .mockResolvedValueOnce({
        items: [{ id: 2, name: 'Alpine' }],
        currentPage: 2,
        totalPages: 2,
        totalItems: 2,
      });

    const { container } = renderAutocomplete({ searchOptions });

    fireEvent.change(within(container).getByLabelText('Resource'), {
      target: { value: 'al' },
    });

    await waitFor(() => {
      expect(searchOptions).toHaveBeenNthCalledWith(1, {
        query: 'al',
        page: 1,
        size: expectedSize,
      });
    });

    const scrollArea = container.querySelector(
      '[data-slot="scroll-area"]',
    ) as HTMLDivElement;

    Object.defineProperty(scrollArea, 'scrollHeight', {
      value: 320,
      configurable: true,
    });
    Object.defineProperty(scrollArea, 'clientHeight', {
      value: 200,
      configurable: true,
    });
    Object.defineProperty(scrollArea, 'scrollTop', {
      value: 95,
      configurable: true,
    });

    fireEvent.scroll(scrollArea);

    await waitFor(() => {
      expect(searchOptions).toHaveBeenNthCalledWith(2, {
        query: 'al',
        page: 2,
        size: expectedSize,
      });
    });
  });

  it('does not render when view access is denied', () => {
    canView = false;

    const { container } = renderAutocomplete({
      accessRequirements: ['resource.read'],
      resolveAccess,
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders disabled when edit access is denied', () => {
    canEdit = false;

    const { container } = renderAutocomplete({
      accessRequirements: ['resource.write'],
      resolveAccess,
    });

    expect(within(container).getByLabelText('Resource')).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('shows clear control for selected value and clears when clicked', async () => {
    const onSelectOption = vi.fn();
    const getOptionById = vi.fn().mockResolvedValue({ id: 2, name: 'Beta' });

    const { container } = renderAutocomplete({
      value: 2,
      onSelectOption,
      getOptionById,
    });

    await waitFor(() => {
      expect(getOptionById).toHaveBeenCalledWith(2);
    });

    fireEvent.click(
      within(container).getByRole('button', { name: 'Clear selection' }),
    );

    expect(onSelectOption).toHaveBeenCalledWith(null);
    expect(within(container).getByLabelText('Resource')).toHaveProperty(
      'value',
      '',
    );
  });
});
