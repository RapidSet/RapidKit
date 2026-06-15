import { useState } from 'react';
import type * as React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFormHandlers } from '@/hooks/useFormHandlers';
import type { FormValidationSchema } from '@/hooks/useFormHandlers';
import { Input } from '@components/Input';
import { Checkbox } from '@components/Checkbox';
import { Form } from './Form';
import { FormField } from './FormField';
import { FormSubmit } from './FormSubmit';
import type { FormFieldRenderArgs } from './types';

type LoginValues = {
  email: string;
  remember: boolean;
};

const initialValues: LoginValues = { email: '', remember: false };

type HarnessOptions = {
  schema?: FormValidationSchema;
  onSubmit?: (values: LoginValues) => void | Promise<void>;
  isSubmitting?: boolean;
  disableOnSubmit?: boolean;
  resetOnSuccess?: boolean;
  serverError?: string;
  successMessage?: string;
  initial?: LoginValues;
  formId?: string;
  showUntouchedError?: boolean;
};

const Harness = (props: HarnessOptions) => {
  const form = useFormHandlers<LoginValues>({
    initialValues: props.initial ?? initialValues,
    schema: props.schema,
    onSubmit: async (values) => {
      await props.onSubmit?.(values);
    },
  });

  return (
    <Form
      form={form}
      id={props.formId}
      isSubmitting={props.isSubmitting}
      disableOnSubmit={props.disableOnSubmit}
      resetOnSuccess={props.resetOnSuccess}
      serverError={props.serverError}
      successMessage={props.successMessage}
    >
      <FormField
        name="email"
        label="Email"
        required
        showUntouchedError={props.showUntouchedError}
      >
        <Input type="email" placeholder="you@example.com" />
      </FormField>
      <FormField name="remember">
        <Checkbox title="Remember me" />
      </FormField>
      <FormSubmit label="Submit" />
    </Form>
  );
};

describe('Form', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders fields and submit button bound to the form', () => {
    render(<Harness />);

    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByText('Remember me')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
  });

  it('calls onSubmit with current values when native submit fires', async () => {
    const onSubmit = vi.fn();
    render(
      <Harness
        onSubmit={onSubmit}
        initial={{ email: 'a@b.co', remember: true }}
      />,
    );

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Submit' }).closest('form')!,
      );
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co', remember: true });
  });

  it('renders default server error banner when serverError is set', () => {
    render(<Harness serverError="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('renders default success banner when successMessage is set', () => {
    render(<Harness successMessage="Saved successfully" />);

    expect(screen.getByText('Saved successfully')).toBeTruthy();
  });

  it('renders custom errorBanner when provided as a function', () => {
    const form = (
      <CustomBannerHarness
        serverError="boom"
        errorBanner={(text) => <div data-testid="custom-banner">!{text}!</div>}
      />
    );
    render(form);
    expect(screen.getByTestId('custom-banner').textContent).toBe('!boom!');
  });

  it('wraps children in a disabled fieldset when isSubmitting', () => {
    render(<Harness isSubmitting />);

    const fieldset = screen
      .getByPlaceholderText('you@example.com')
      .closest('fieldset');
    expect(fieldset).toBeTruthy();
    expect((fieldset as HTMLFieldSetElement).disabled).toBe(true);
    expect(
      (screen.getByPlaceholderText('you@example.com') as HTMLInputElement)
        .disabled,
    ).toBe(true);
  });

  it('does not disable fieldset when disableOnSubmit is false', () => {
    render(<Harness isSubmitting disableOnSubmit={false} />);

    const fieldset = screen
      .getByPlaceholderText('you@example.com')
      .closest('fieldset');
    expect((fieldset as HTMLFieldSetElement).disabled).toBe(false);
  });

  it('calls resetForm only when handleSubmit succeeds and resetOnSuccess is true', async () => {
    render(
      <Harness
        resetOnSuccess
        initial={{ email: 'baseline@here.io', remember: true }}
      />,
    );

    const emailInput = screen.getByPlaceholderText(
      'you@example.com',
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'changed@here.io' } });
    expect(
      (screen.getByPlaceholderText('you@example.com') as HTMLInputElement)
        .value,
    ).toBe('changed@here.io');

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Submit' }).closest('form')!,
      );
    });

    expect(
      (screen.getByPlaceholderText('you@example.com') as HTMLInputElement)
        .value,
    ).toBe('baseline@here.io');
  });

  it('does not reset when validation fails', async () => {
    const schema: FormValidationSchema = {
      safeParse: () => ({
        success: false,
        error: {
          issues: [{ path: ['email'], message: 'Email is required' }],
        },
      }),
    };

    render(
      <Harness
        resetOnSuccess
        schema={schema}
        initial={{ email: 'kept@here.io', remember: false }}
      />,
    );

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Submit' }).closest('form')!,
      );
    });

    expect(
      (screen.getByPlaceholderText('you@example.com') as HTMLInputElement)
        .value,
    ).toBe('kept@here.io');
  });
});

describe('FormField', () => {
  afterEach(() => {
    cleanup();
  });

  it('injects text bindings into an Input child', () => {
    render(<Harness initial={{ email: 'seed@x.io', remember: false }} />);

    const input = screen.getByPlaceholderText(
      'you@example.com',
    ) as HTMLInputElement;
    expect(input.value).toBe('seed@x.io');
    expect(input.name).toBe('email');

    fireEvent.change(input, { target: { value: 'next@x.io' } });
    expect(
      (screen.getByPlaceholderText('you@example.com') as HTMLInputElement)
        .value,
    ).toBe('next@x.io');
  });

  it('injects checkbox bindings into a Checkbox child', () => {
    render(<Harness initial={{ email: '', remember: true }} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    expect(checkbox.name).toBe('remember');

    fireEvent.click(checkbox);
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      false,
    );
  });

  it('forwards label and required asterisk via Input chrome (no duplicate label)', () => {
    render(<Harness />);

    expect(screen.getAllByText('Email')).toHaveLength(1);
    expect(screen.getAllByText('*')).toHaveLength(1);
  });

  it('shows touched validation errors after blur', async () => {
    const schema: FormValidationSchema = {
      safeParse: () => ({
        success: false,
        error: {
          issues: [{ path: ['email'], message: 'Email is required' }],
        },
      }),
    };

    render(<Harness schema={schema} />);

    expect(screen.queryByText('Email is required')).toBeNull();

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Submit' }).closest('form')!,
      );
    });

    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  it('passes render-prop children a full FormFieldRenderArgs object', () => {
    let captured: FormFieldRenderArgs | null = null;
    const RenderPropHarness = () => {
      const form = useFormHandlers<LoginValues>({
        initialValues: { email: 'rp@x.io', remember: true },
      });
      return (
        <Form form={form}>
          <FormField name="email">
            {(field) => {
              captured = field;
              return <span data-testid="rp">{String(field.value)}</span>;
            }}
          </FormField>
        </Form>
      );
    };
    render(<RenderPropHarness />);

    expect(captured).not.toBeNull();
    expect(captured!.name).toBe('email');
    expect(captured!.value).toBe('rp@x.io');
    expect(captured!.id).toBe('rk-form-email');
    expect(typeof captured!.onChange).toBe('function');
    expect(typeof captured!.onCheckChange).toBe('function');
    expect(typeof captured!.onBlur).toBe('function');
    expect(screen.getByTestId('rp').textContent).toBe('rp@x.io');
  });

  it('uses formId to build a deterministic field id', () => {
    render(<Harness formId="signin" />);

    expect(
      (screen.getByPlaceholderText('you@example.com') as HTMLInputElement).id,
    ).toBe('signin-email');
  });

  it('renders a description above the input when provided', () => {
    const WithDescription = () => {
      const form = useFormHandlers<LoginValues>({ initialValues });
      return (
        <Form form={form}>
          <FormField name="email" description="We never share your email.">
            <Input type="email" />
          </FormField>
        </Form>
      );
    };

    render(<WithDescription />);
    expect(screen.getByText('We never share your email.')).toBeTruthy();
  });

  it('binding wins over a value prop accidentally set on the child', () => {
    const Override = () => {
      const form = useFormHandlers<LoginValues>({
        initialValues: { email: 'bound@x.io', remember: false },
      });
      return (
        <Form form={form}>
          <FormField name="email">
            <Input type="email" value="ignored" onChange={() => undefined} />
          </FormField>
        </Form>
      );
    };
    render(<Override />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      'bound@x.io',
    );
  });

  it('honors explicit override error prop', () => {
    const Override = () => {
      const form = useFormHandlers<LoginValues>({ initialValues });
      return (
        <Form form={form}>
          <FormField name="email" error="Forced error">
            <Input type="email" />
          </FormField>
        </Form>
      );
    };
    render(<Override />);
    expect(screen.getByText('Forced error')).toBeTruthy();
  });

  it('honors as="checkbox" override even when value is not boolean', () => {
    let captured: FormFieldRenderArgs | null = null;
    const ForcedCheckbox = () => {
      const form = useFormHandlers<LoginValues>({ initialValues });
      return (
        <Form form={form}>
          <FormField name="email" as="checkbox">
            {(field) => {
              captured = field;
              return <span />;
            }}
          </FormField>
        </Form>
      );
    };
    render(<ForcedCheckbox />);
    expect(captured).not.toBeNull();
    expect(captured!.checked).toBe(false);
  });
});

describe('FormSubmit', () => {
  afterEach(() => {
    cleanup();
  });

  it('defaults to type="submit"', () => {
    render(<Harness />);
    expect(
      screen.getByRole('button', { name: 'Submit' }).getAttribute('type'),
    ).toBe('submit');
  });

  it('shows loading and disabled state when isSubmitting is true', () => {
    render(<Harness isSubmitting />);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('keeps the button enabled when loadingWhenSubmitting and disableWhenSubmitting are both false', () => {
    const NoLoadingHarness = () => {
      const form = useFormHandlers<LoginValues>({ initialValues });
      return (
        <Form form={form} isSubmitting>
          <FormSubmit
            label="Go"
            loadingWhenSubmitting={false}
            disableWhenSubmitting={false}
          />
        </Form>
      );
    };
    render(<NoLoadingHarness />);
    const button = screen.getByRole('button', { name: 'Go' });
    expect((button as HTMLButtonElement).disabled).toBe(false);
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('throws when used outside <Form>', () => {
    const originalError = console.error;
    console.error = () => undefined;
    expect(() => render(<FormSubmit label="Loose" />)).toThrow(
      /Form context is missing/,
    );
    console.error = originalError;
  });
});

type CustomBannerHarnessProps = {
  serverError: string;
  errorBanner: (text: string) => React.ReactElement;
};

const CustomBannerHarness = (props: CustomBannerHarnessProps) => {
  const [seed] = useState(initialValues);
  const form = useFormHandlers<LoginValues>({ initialValues: seed });
  return (
    <Form
      form={form}
      serverError={props.serverError}
      errorBanner={props.errorBanner}
    >
      <FormSubmit label="Submit" />
    </Form>
  );
};
