import type {
  FormErrors,
  FormValues,
  UseFormHandlersOptions,
  UseFormHandlersReturn,
} from '../useFormHandlers';

export type FormMutationTriggerResult<TResponse> = {
  unwrap: () => Promise<TResponse>;
};

export type FormMutationTrigger<TArg, TResponse> = (
  arg: TArg,
) => FormMutationTriggerResult<TResponse>;

export type FormMutationResultLike = {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: unknown;
  reset?: () => void;
};

export type FormMutationHookTuple<TArg, TResponse> = readonly [
  FormMutationTrigger<TArg, TResponse>,
  FormMutationResultLike,
];

export type FormMutationHook<TArg, TResponse> = () => FormMutationHookTuple<
  TArg,
  TResponse
>;

export type FormMutationErrorResult<TValues extends FormValues> = {
  fieldErrors?: FormErrors<TValues>;
  formError?: string;
};

export type FormMutationMappedError<TValues extends FormValues> =
  | FormMutationErrorResult<TValues>
  | string
  | undefined
  | null
  | void;

export type UseFormMutationOptions<
  TValues extends FormValues,
  TArg = TValues,
  TResponse = unknown,
> = Omit<UseFormHandlersOptions<TValues>, 'onSubmit'> & {
  mutation: FormMutationHook<TArg, TResponse>;
  toRequest?: (values: TValues) => TArg;
  mapError?: (error: unknown) => FormMutationMappedError<TValues>;
  onSuccess?: (data: TResponse, values: TValues) => void | Promise<void>;
  onError?: (error: unknown) => void;
  resetOnSuccess?: boolean;
};

export type UseFormMutationReturn<
  TValues extends FormValues,
  TResponse = unknown,
> = UseFormHandlersReturn<TValues> & {
  isSubmitting: boolean;
  serverError?: string;
  lastResponse?: TResponse;
};
