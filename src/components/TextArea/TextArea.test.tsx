import type * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { TextArea } from './TextArea';

let allowsRead = true;
let allowsWrite = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'edit' },
    mode: 'view' | 'edit',
  ) => (mode === 'view' ? allowsRead : allowsWrite),
);

const renderTextArea = (
  overrides: Partial<React.ComponentProps<typeof TextArea>> = {},
) => {
  const onChange = vi.fn();

  render(
    <TextArea
      name="details"
      value=""
      onChange={onChange}
      placeholder="Describe here"
      {...overrides}
    />,
  );

  return { onChange };
};

describe('TextArea', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    allowsRead = true;
    allowsWrite = true;
    canAccess.mockClear();
  });

  it('renders label, required marker, and value', () => {
    renderTextArea({
      name: 'bio',
      label: 'Bio',
      required: true,
      value: 'Platform engineer',
    });

    expect(screen.getByText('Bio')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: /bio/i }) as HTMLTextAreaElement)
        .value,
    ).toBe('Platform engineer');
  });

  it('calls onChange when user types', () => {
    const { onChange } = renderTextArea({ name: 'notes' });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Some notes' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].type).toBe('change');
  });

  it('renders helper, info, and error text when provided', () => {
    renderTextArea({
      name: 'summary',
      helperText: 'Give a short summary',
      infoText: 'Maximum 280 characters',
      error: 'Summary is required',
    });

    expect(screen.getByText('Give a short summary')).toBeTruthy();
    expect(screen.getByText('Maximum 280 characters')).toBeTruthy();
    expect(screen.getByText('Summary is required')).toBeTruthy();
    expect(screen.getByRole('textbox').className).toContain(
      'border-destructive',
    );
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('keeps textarea enabled when access checks are omitted', () => {
    renderTextArea({ name: 'about' });

    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(
      false,
    );
  });

  it('hides textarea when read access is denied', () => {
    allowsRead = false;

    const { container } = render(
      <TextArea
        name="hiddenAbout"
        value="value"
        access={{ rules: [{ action: 'read', subject: 'profile' }] }}
        canAccess={canAccess}
        onChange={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'profile' },
      'view',
    );
    expect(canAccess).not.toHaveBeenCalledWith(
      { action: 'read', subject: 'profile' },
      'edit',
    );
  });

  it('disables textarea when edit permission is denied', () => {
    allowsRead = true;
    allowsWrite = false;

    renderTextArea({
      name: 'readonlyAbout',
      value: 'locked',
      access: { rules: [{ action: 'write', subject: 'profile' }] },
      canAccess,
    });

    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(
      true,
    );
    expect(canAccess).not.toHaveBeenCalledWith(
      { action: 'write', subject: 'profile' },
      'view',
    );
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'write', subject: 'profile' },
      'edit',
    );
  });

  it('stops keydown propagation and still calls consumer onKeyDown', () => {
    const bodyListener = vi.fn();
    const onKeyDown = vi.fn();

    document.body.addEventListener('keydown', bodyListener);
    renderTextArea({ name: 'comment', onKeyDown });

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(bodyListener).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    document.body.removeEventListener('keydown', bodyListener);
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <TextArea
          name="providerHiddenTextArea"
          value="value"
          access={{ rules: [{ action: 'read', subject: 'profile' }] }}
          onChange={vi.fn()}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <TextArea
          name="providerOverrideTextArea"
          value="allowed"
          access={{ rules: [{ action: 'read', subject: 'profile' }] }}
          canAccess={() => true}
          onChange={vi.fn()}
        />
      </RapidKitAccessProvider>,
    );

    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe(
      'allowed',
    );
  });
});
