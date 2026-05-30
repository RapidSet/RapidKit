import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Toaster } from './Toaster';
import { toast } from './toast';
import { TOAST_VARIANT_CLASS_NAMES, ToastVariant } from './styles';

const flushToasts = () => {
  toast.dismiss();
};

describe('Toaster', () => {
  afterEach(() => {
    flushToasts();
    cleanup();
  });

  it('mounts a polite live region for screen reader announcements', () => {
    render(<Toaster />);

    const liveRegion = document.body.querySelector(
      'section[aria-live="polite"]',
    );
    expect(liveRegion).toBeTruthy();
  });

  it('mounts the sonner toaster region once a toast is dispatched', async () => {
    render(<Toaster />);

    act(() => {
      toast('Project synced');
    });

    await waitFor(() => {
      const region = document.body.querySelector('[data-sonner-toaster]');
      expect(region).toBeTruthy();
    });
  });

  it('forwards default position to the underlying primitive', async () => {
    render(<Toaster />);

    act(() => {
      toast('positioning probe');
    });

    await waitFor(() => {
      const region = document.body.querySelector('[data-sonner-toaster]');
      expect(region?.getAttribute('data-y-position')).toBe('bottom');
      expect(region?.getAttribute('data-x-position')).toBe('right');
    });
  });

  it('forwards custom position prop', async () => {
    render(<Toaster position="top-left" />);

    act(() => {
      toast('positioning probe');
    });

    await waitFor(() => {
      const region = document.body.querySelector('[data-sonner-toaster]');
      expect(region?.getAttribute('data-y-position')).toBe('top');
      expect(region?.getAttribute('data-x-position')).toBe('left');
    });
  });

  it('merges consumer className onto the toaster wrapper', async () => {
    render(<Toaster className="custom-toaster" />);

    act(() => {
      toast('classname probe');
    });

    await waitFor(() => {
      const region = document.body.querySelector('[data-sonner-toaster]');
      expect(region?.className ?? '').toContain('custom-toaster');
      expect(region?.className ?? '').toContain('toaster');
    });
  });
});

describe('toast API', () => {
  afterEach(() => {
    flushToasts();
  });

  it('is a callable function', () => {
    expect(typeof toast).toBe('function');
  });

  it('exposes every documented variant method', () => {
    expect(typeof toast.success).toBe('function');
    expect(typeof toast.error).toBe('function');
    expect(typeof toast.warning).toBe('function');
    expect(typeof toast.info).toBe('function');
    expect(typeof toast.loading).toBe('function');
    expect(typeof toast.message).toBe('function');
    expect(typeof toast.promise).toBe('function');
    expect(typeof toast.dismiss).toBe('function');
  });

  it('returns an id when a toast is dispatched', () => {
    const id = toast.success('Saved');
    expect(id).not.toBeUndefined();
    expect(['string', 'number']).toContain(typeof id);
  });
});

describe('toast variant styles', () => {
  it('exposes a non-empty class string for each non-default variant', () => {
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Success]).not.toBe('');
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Error]).not.toBe('');
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Warning]).not.toBe('');
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Info]).not.toBe('');
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Loading]).not.toBe('');
  });

  it('targets the destructive token for the error variant', () => {
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Error]).toContain(
      'border-destructive',
    );
    expect(TOAST_VARIANT_CLASS_NAMES[ToastVariant.Error]).toContain(
      'text-destructive',
    );
  });

  it('drives variants from sonner data-type attribute selectors', () => {
    for (const variant of Object.values(ToastVariant)) {
      if (variant === ToastVariant.Default) {
        continue;
      }

      expect(TOAST_VARIANT_CLASS_NAMES[variant]).toContain(
        `data-[type=${variant}]`,
      );
    }
  });
});
