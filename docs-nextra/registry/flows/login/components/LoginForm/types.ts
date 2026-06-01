import type { useFormHandlers } from '@rapidset/rapidkit';
import type { LoginFormValues } from '../../services/auth';

export type LoginFormProps = Readonly<{
  form: ReturnType<typeof useFormHandlers<LoginFormValues>>;
  submitMessage: string | null;
}>;
