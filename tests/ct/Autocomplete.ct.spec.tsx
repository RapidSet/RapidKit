import { expect, test } from '@playwright/experimental-ct-react';
import { AutocompleteHarness } from './fixtures/AutocompleteHarness';

test.describe('Autocomplete Option Separators', () => {
  test('renders visible horizontal separators between options', async ({
    mount,
    page,
  }) => {
    const component = await mount(<AutocompleteHarness />);

    await component.getByRole('button', { name: 'Open options' }).click();

    await expect(page.getByText('Jordan Kim')).toBeVisible();

    const firstOption = page.getByRole('button', { name: 'Alex Rivera' });
    const secondOption = page.getByRole('button', { name: 'Jordan Kim' });

    const firstStyle = await firstOption.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLElement);
      return {
        borderTopWidth: computed.borderTopWidth,
      };
    });

    const separatorStyle = await secondOption.evaluate((node) => {
      const previous = node.previousElementSibling;
      const computed = getComputedStyle(node as HTMLElement);
      return {
        borderTopWidth: computed.borderTopWidth,
        borderTopColor: computed.borderTopColor,
        hasPreviousSibling: Boolean(previous),
      };
    });

    expect(firstStyle.borderTopWidth).toBe('0px');
    expect(separatorStyle.hasPreviousSibling).toBe(true);
    expect(separatorStyle.borderTopWidth).toBe('1px');
    expect(separatorStyle.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
