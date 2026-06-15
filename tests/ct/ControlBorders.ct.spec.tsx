import { expect, test } from '@playwright/experimental-ct-react';
import type { CSSProperties } from 'react';
import { Input } from '../../src/components/Input';
import { DropDown } from '../../src/components/DropDown';
import { Search } from '../../src/components/Search';

const LIGHT_SURFACE_STYLE = {
  '--rk-background': '0 0% 99%',
  '--rk-card': '0 0% 99%',
  '--rk-foreground': '220 20% 16%',
  '--rk-control-border': '220 20% 16% / 0.4',
  '--rk-ring': '210 100% 46%',
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

  test('Input border shifts to ring color on focus-visible', async ({
    mount,
    page,
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

    const restingBorder = await input.evaluate(
      (node) => getComputedStyle(node as HTMLInputElement).borderTopColor,
    );

    // Tab-focus to trigger :focus-visible — programmatic .focus() sets
    // :focus but NOT :focus-visible in spec-compliant Chromium headless.
    await page.keyboard.press('Tab');

    const focusedBorder = await input.evaluate(
      (node) => getComputedStyle(node as HTMLInputElement).borderTopColor,
    );

    expect(focusedBorder).not.toBe(restingBorder);
  });

  test('Search icon is vertically centered inside its input', async ({
    mount,
  }) => {
    const component = await mount(
      <div style={LIGHT_SURFACE_STYLE}>
        <Search value="" onChange={() => undefined} placeholder="Search" />
      </div>,
    );

    const icon = component.locator('svg').first();

    const offsets = await icon.evaluate((iconNode, inputSelector) => {
      const inputNode = document.querySelector(inputSelector) as HTMLElement;
      const i = iconNode.getBoundingClientRect();
      const f = inputNode.getBoundingClientRect();
      return {
        iconCenter: i.top + i.height / 2,
        fieldCenter: f.top + f.height / 2,
      };
    }, 'input');

    expect(Math.abs(offsets.iconCenter - offsets.fieldCenter)).toBeLessThan(1);
  });

  test('DropDown clear icon is vertically centered inside the trigger', async ({
    mount,
  }) => {
    const component = await mount(
      <div style={LIGHT_SURFACE_STYLE}>
        <div style={{ maxWidth: 320 }}>
          <DropDown
            label="Country"
            value="US"
            options={[
              { label: 'United States', value: 'US' },
              { label: 'Canada', value: 'CA' },
            ]}
            onChange={() => undefined}
          />
        </div>
      </div>,
    );

    const clearButton = component.locator(
      'button[aria-label="Clear selection"]',
    );

    const offsets = await clearButton.evaluate((btn, triggerSelector) => {
      const t = document.querySelector(triggerSelector) as HTMLElement;
      const b = btn.getBoundingClientRect();
      const r = t.getBoundingClientRect();
      return {
        buttonCenter: b.top + b.height / 2,
        triggerCenter: r.top + r.height / 2,
      };
    }, '[data-slot="select-trigger"]');

    expect(Math.abs(offsets.buttonCenter - offsets.triggerCenter)).toBeLessThan(
      1,
    );
  });

  test('DropDown trigger border shifts to ring color on focus', async ({
    mount,
    page,
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

    const restingBorder = await trigger.evaluate(
      (node) => getComputedStyle(node as HTMLElement).borderTopColor,
    );

    // Tab-focus to trigger :focus — programmatic .focus() in headless
    // Chromium occasionally misses the focus-style cascade; keyboard
    // navigation makes it deterministic.
    await page.keyboard.press('Tab');

    const focusedBorder = await trigger.evaluate(
      (node) => getComputedStyle(node as HTMLElement).borderTopColor,
    );

    expect(focusedBorder).not.toBe(restingBorder);
  });
});
