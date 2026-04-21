import { useCallback, type CSSProperties } from 'react';
import { Autocomplete } from '../../../src/components/Autocomplete';

interface AssigneeOption {
  id: string;
  name: string;
}

const LIGHT_SURFACE_STYLE = {
  '--rk-background': '0 0% 99%',
  '--rk-card': '0 0% 99%',
  '--rk-foreground': '220 20% 16%',
  '--rk-control-border': '220 20% 16% / 0.4',
} as CSSProperties;

export function AutocompleteHarness() {
  const options: AssigneeOption[] = [
    { id: 'alex', name: 'Alex Rivera' },
    { id: 'jordan', name: 'Jordan Kim' },
    { id: 'sam', name: 'Sam Lee' },
  ];

  const searchOptions = useCallback(async () => {
    return {
      items: options,
      currentPage: 1,
      totalPages: 1,
      totalItems: options.length,
    };
  }, []);

  return (
    <div style={LIGHT_SURFACE_STYLE}>
      <div style={{ maxWidth: 360 }}>
        <Autocomplete<AssigneeOption>
          name="assignee"
          label="Assignee"
          value={null}
          onSelectOption={() => undefined}
          searchOptions={searchOptions}
        />
      </div>
    </div>
  );
}
