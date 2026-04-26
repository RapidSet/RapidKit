import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type {
  AutocompleteAccessConfig,
  AutocompleteAccessResolver,
} from './types';

export const resolveAutocompleteAccessState = (
  access: AutocompleteAccessConfig | undefined,
  canAccess: AutocompleteAccessResolver | undefined,
) => resolveViewEditAccessState(access, canAccess);
