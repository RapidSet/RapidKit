import { expect, test } from '@playwright/experimental-ct-react';
import { Input } from '../../src/components/Input';

test.describe('Input (Component Test)', () => {
  test('renders label, required marker, and controlled value', async ({
    mount,
  }) => {
    const component = await mount(
      <Input
        name="fullName"
        label="Full Name"
        required
        value="Ada Lovelace"
        onChange={() => {}}
      />,
    );

    await expect(component.getByText('Full Name')).toBeVisible();
    await expect(component.getByText('*')).toBeVisible();
    await expect(
      component.getByRole('textbox', { name: 'Full Name' }),
    ).toHaveValue('Ada Lovelace');
  });

  test('hides input when read check fails', async ({ mount }) => {
    const component = await mount(
      <Input
        name="hiddenField"
        value="hidden"
        accessRequirements={['control.read']}
        resolveAccess={(_, mode) => mode !== 'view'}
        onChange={() => {}}
      />,
    );

    await expect(component.getByRole('textbox')).toHaveCount(0);
  });

  test('disables input when write check fails', async ({ mount }) => {
    const allowsRead = true;
    const allowsWrite = false;

    const component = await mount(
      <Input
        name="readOnlyField"
        value="locked"
        accessRequirements={['control.write']}
        resolveAccess={(_, mode) =>
          mode === 'view' ? allowsRead : allowsWrite
        }
        onChange={() => {}}
      />,
    );

    await expect(component.locator('input')).toBeDisabled();
  });

  test('stops keydown bubbling but still invokes consumer key handler', async ({
    mount,
  }) => {
    let parentCount = 0;
    let inputCount = 0;

    const component = await mount(
      <div onKeyDown={() => (parentCount += 1)}>
        <Input
          name="search"
          value=""
          onChange={() => {}}
          onKeyDown={() => (inputCount += 1)}
        />
      </div>,
    );

    await component.getByRole('textbox').press('Enter');

    expect(parentCount).toBe(0);
    expect(inputCount).toBe(1);
  });
});
