import { expect, test } from '@playwright/experimental-ct-react';
import type { CSSProperties } from 'react';
import { Input } from '../../src/components/Input';
import { DropDown } from '../../src/components/DropDown';

const LIGHT_SURFACE_STYLE = {
  '--rk-background': '0 0% 99%',
  '--rk-card': '0 0% 99%',
  '--rk-foreground': '220 20% 16%',
  '--rk-control-border': '220 20% 16% / 0.4',
} as CSSProperties;

test.describe('Control Border Visibility', () => {
  test('Input renders a visible border on a light surface', async ({
    mount,
  }) => {
    const component = await mount(
      <div style={LIGHT_SURFACE_STYLE}>
        <div style={{ maxWidth: 360 }}>
          <Input
            name="email"
            label="Email"
            value=""
            onChange={() => undefined}
            placeholder="name@company.com"
          />
        </div>
      </div>,
    );

    const input = component.locator('input[name="email"]');

    const style = await input.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLInputElement);
      return {
        borderTopWidth: computed.borderTopWidth,
        borderTopColor: computed.borderTopColor,
        backgroundColor: computed.backgroundColor,
        boxShadow: computed.boxShadow,
      };
    });

    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderTopColor).not.toBe(style.backgroundColor);
    expect(style.boxShadow).not.toBe('none');
  });

  test('DropDown trigger renders a visible border on a light surface', async ({
    mount,
  }) => {
    const component = await mount(
      <div style={LIGHT_SURFACE_STYLE}>
        <div style={{ maxWidth: 320 }}>
          <DropDown
            label="Country"
            value=""
            placeholder="Select country"
            options={[
              { label: 'United States', value: 'US' },
              { label: 'Canada', value: 'CA' },
            ]}
            onChange={() => undefined}
          />
        </div>
      </div>,
    );

    const trigger = component.locator('[data-slot="select-trigger"]');

    const style = await trigger.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLElement);
      return {
        borderTopWidth: computed.borderTopWidth,
        borderTopColor: computed.borderTopColor,
        backgroundColor: computed.backgroundColor,
        boxShadow: computed.boxShadow,
      };
    });

    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderTopColor).not.toBe(style.backgroundColor);
    expect(style.boxShadow).not.toBe('none');
  });
});
