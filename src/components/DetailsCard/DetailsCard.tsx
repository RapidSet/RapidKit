import { DetailsCardProps } from './types';
import { DetailsCardHeader } from './components/DetailsCardHeader/DetailsCardHeader';
import { DetailsCardBody } from './components/DetailsCardBody/DetailsCardBody';

export const DetailsCard = <T,>(props: DetailsCardProps<T>) => {
  const {
    icon,
    data,
    title,
    isLoading,
    onClose,
    onSave,
    onDelete,
    tabs = [],
    renderCustomContent,
    saveAccessRequirements,
    deleteAccessRequirements,
    customButtons = [],
  } = props;

  const shouldShowCustomContent = Boolean(renderCustomContent);
  const shouldShowTabs = tabs.length > 0;

  return (
    <section className="flex h-full w-full flex-col overflow-y-auto rounded-sm border">
      <DetailsCardHeader
        icon={icon}
        data={data || null}
        title={title}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
        saveAccessRequirements={saveAccessRequirements}
        deleteAccessRequirements={deleteAccessRequirements}
        customButtons={customButtons}
      />
      {shouldShowCustomContent && (
        <div className="mx-6 border-t border-border" />
      )}
      {shouldShowCustomContent && renderCustomContent?.()}
      {shouldShowTabs && <div className="mx-6 border-t border-border" />}
      {shouldShowTabs && <DetailsCardBody isLoading={isLoading} tabs={tabs} />}
    </section>
  );
};
