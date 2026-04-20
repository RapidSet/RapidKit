import { expect, test } from '@playwright/experimental-ct-react';
import type { CSSProperties } from 'react';
import { DatePicker } from '../../src/components/DatePicker';

const BASE_THEME_STYLE = {
  '--mz-control-border': '220 18% 35% / 0.45',
  '--mz-control-font-size': '0.875rem',
} as CSSProperties;

test.describe('DatePicker Theme Styling (Component Test)', () => {
  test('trigger uses themed border, typography, and left alignment', async ({
    mount,
  }) => {
    const component = await mount(
      <div style={BASE_THEME_STYLE}>
        <DatePicker
          name="startDate"
          value=""
          placeholder="Pick a date"
          onChange={() => {}}
        />
      </div>,
    );

    const trigger = component.locator('button#startDate');

    const style = await trigger.evaluate((node) => {
      const computed = getComputedStyle(node);
      return {
        borderWidth: computed.borderWidth,
        borderColor: computed.borderColor,
        textAlign: computed.textAlign,
        fontWeight: computed.fontWeight,
        fontSize: computed.fontSize,
        justifyContent: computed.justifyContent,
      };
    });

    expect(style.borderWidth).toBe('1px');
    expect(style.borderColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(style.textAlign).toBe('left');
    expect(style.justifyContent).toBe('flex-start');
    expect(Number(style.fontWeight)).toBeGreaterThanOrEqual(500);
    expect(style.fontSize).toBe('14px');
  });

  test('trigger border responds to theme control-border token', async ({
    mount,
  }) => {
    const component = await mount(
      <div className="flex gap-4">
        <div
          style={
            { '--mz-control-border': '210 10% 30% / 0.45' } as CSSProperties
          }
        >
          <DatePicker name="date-a" value="" onChange={() => {}} />
        </div>
        <div
          style={{ '--mz-control-border': '24 90% 42% / 0.6' } as CSSProperties}
        >
          <DatePicker name="date-b" value="" onChange={() => {}} />
        </div>
      </div>,
    );

    const borderA = await component
      .locator('button#date-a')
      .evaluate((node) => getComputedStyle(node).borderColor);
    const borderB = await component
      .locator('button#date-b')
      .evaluate((node) => getComputedStyle(node).borderColor);

    expect(borderA).not.toBe(borderB);
  });

  test('calendar popup follows themed typography and borders', async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <div style={BASE_THEME_STYLE}>
        <DatePicker
          name="calendarDate"
          value="2024-01-02"
          onChange={() => {}}
        />
      </div>,
    );

    await component.locator('button#calendarDate').click();

    const dialog = page.getByRole('dialog').first();
    const weekdayHeader = page.locator('thead th').first();

    await expect(dialog).toBeVisible();

    const dialogStyle = await dialog.evaluate((node) => {
      const computed = getComputedStyle(node);
      return {
        borderWidth: computed.borderWidth,
        borderColor: computed.borderColor,
      };
    });

    const weekdayStyle = await weekdayHeader.evaluate((node) => {
      const computed = getComputedStyle(node);
      return {
        fontWeight: computed.fontWeight,
        fontSize: computed.fontSize,
      };
    });

    expect(dialogStyle.borderWidth).toBe('1px');
    expect(dialogStyle.borderColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(Number(weekdayStyle.fontWeight)).toBeGreaterThanOrEqual(500);
    expect(Number.parseFloat(weekdayStyle.fontSize)).toBeLessThanOrEqual(12);
  });
});
