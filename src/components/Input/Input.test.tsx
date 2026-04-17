import type * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

let allowsRead = true;
let allowsWrite = true;

const resolveAccess = vi.fn((_: string, mode: 'view' | 'edit') =>
  mode === 'view' ? allowsRead : allowsWrite,
);

const renderInput = (
  overrides: Partial<React.ComponentProps<typeof Input>> = {},
) => {
  const onChange = vi.fn();

  render(<Input name="field" value="" onChange={onChange} {...overrides} />);

  return { onChange };
};

const installThemeProbeStyles = () => {
  const styleId = 'theme-probe-styles';
  const existing = document.getElementById(styleId);
  if (existing) {
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .bg-background { background-color: var(--mz-background-color) !important; }
    .border-input { border-color: var(--mz-border-color) !important; }
  `;
  document.head.appendChild(style);
};

describe('Input', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    allowsRead = true;
    allowsWrite = true;
    resolveAccess.mockClear();
    installThemeProbeStyles();
  });

  it('renders label, required marker, and value', () => {
    renderInput({
      name: 'fullName',
      label: 'Full Name',
      required: true,
      value: 'John Doe',
    });

    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: /full name/i }) as HTMLInputElement)
        .value,
    ).toBe('John Doe');
  });

  it('calls onChange when user types', () => {
    const { onChange } = renderInput({ name: 'email' });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'a@example.com' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].type).toBe('change');
  });

  it('renders helper text when provided and no error', () => {
    renderInput({ name: 'phone', helperText: 'Assistive note' });

    expect(screen.getByText('Assistive note')).toBeTruthy();
  });

  it('renders helper text and error text together when both are provided', () => {
    renderInput({
      name: 'username',
      helperText: 'Assistive note',
      error: 'This field is required',
    });

    expect(screen.getByText('Assistive note')).toBeTruthy();
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('renders error text and error class', () => {
    renderInput({ name: 'fieldWithError', error: 'Invalid value' });

    expect(screen.getByText('Invalid value')).toBeTruthy();
    expect(screen.getByRole('textbox').className).toContain(
      'border-destructive',
    );
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('keeps input enabled when access checks are omitted', () => {
    renderInput({ name: 'nickname', value: 'mez' });

    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(
      false,
    );
    expect((screen.getByDisplayValue('mez') as HTMLInputElement).value).toBe(
      'mez',
    );
  });

  it('keeps input enabled when access checks are empty', () => {
    allowsRead = false;
    allowsWrite = false;

    renderInput({
      name: 'alias',
      value: 'mez',
      accessRequirements: [],
      resolveAccess,
    });

    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(
      false,
    );
    expect(resolveAccess).not.toHaveBeenCalled();
  });

  it('hides input when read access is denied', () => {
    allowsRead = false;

    const { container } = render(
      <Input
        name="hiddenField"
        value="value"
        accessRequirements={['control.read']}
        resolveAccess={resolveAccess}
        onChange={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(resolveAccess).toHaveBeenCalledWith('control.read', 'view');
    expect(resolveAccess).not.toHaveBeenCalledWith('control.read', 'edit');
  });

  it('keeps input enabled when requirements exist but resolver is missing', () => {
    renderInput({
      name: 'fallbackField',
      value: 'open',
      accessRequirements: ['control.read'],
    });

    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(
      false,
    );
  });

  it('disables input when read is allowed but write is denied', () => {
    allowsRead = true;
    allowsWrite = false;

    renderInput({
      name: 'readonlyField',
      value: 'locked',
      accessRequirements: ['control.write'],
      resolveAccess,
    });

    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(
      true,
    );
    expect(resolveAccess).not.toHaveBeenCalledWith('control.write', 'view');
    expect(resolveAccess).toHaveBeenCalledWith('control.write', 'edit');
  });

  it('keeps the input disabled when disabled is passed explicitly', () => {
    allowsRead = true;
    allowsWrite = true;

    renderInput({ name: 'disabledField', value: 'locked', disabled: true });

    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it('stops keydown propagation on the input element', () => {
    const onKeyDown = vi.fn();
    document.body.addEventListener('keydown', onKeyDown);

    renderInput({ name: 'search' });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(onKeyDown).not.toHaveBeenCalled();
    document.body.removeEventListener('keydown', onKeyDown);
  });

  it('still calls consumer onKeyDown after stopping propagation', () => {
    const onKeyDown = vi.fn();

    renderInput({ name: 'searchWithHandler', onKeyDown });

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('keeps semantic token utility classes for theme compatibility', () => {
    renderInput({ name: 'themeField' });

    const className = screen.getByRole('textbox').className;
    expect(className).toContain('bg-background');
    expect(className).toContain('border-input');
    expect(className).toContain('ring-offset-background');
    expect(className).toContain('focus-visible:ring-ring');
  });

  it('applies overridden theme variable values to computed styles', () => {
    document.documentElement.style.setProperty(
      '--mz-background-color',
      'rgb(12, 34, 56)',
    );
    document.documentElement.style.setProperty(
      '--mz-border-color',
      'rgb(65, 43, 21)',
    );

    renderInput({ name: 'themedComputedField' });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const initialStyle = getComputedStyle(input);
    expect(initialStyle.backgroundColor).toBe('rgb(12, 34, 56)');
    expect(initialStyle.borderColor).toBe('rgb(65, 43, 21)');

    document.documentElement.style.setProperty(
      '--mz-background-color',
      'rgb(100, 110, 120)',
    );
    document.documentElement.style.setProperty(
      '--mz-border-color',
      'rgb(130, 140, 150)',
    );

    const updatedStyle = getComputedStyle(input);
    expect(updatedStyle.backgroundColor).toBe('rgb(100, 110, 120)');
    expect(updatedStyle.borderColor).toBe('rgb(130, 140, 150)');
  });
});
