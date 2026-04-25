import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { TextAreaProps } from '@components/TextArea/types';

export const resolveTextAreaAccessState = (
  access: TextAreaProps['access'],
  canAccess: TextAreaProps['canAccess'],
) => {
  const { canView, canEdit } = resolveViewEditAccessState(access, canAccess);

  return {
    hasViewPermission: canView,
    hasEditPermission: canEdit,
  };
};
