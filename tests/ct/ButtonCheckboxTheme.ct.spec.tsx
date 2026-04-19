import { expect, test } from '@playwright/experimental-ct-react';
import type { CSSProperties } from 'react';
import { Checkbox } from '../../src/components/Checkbox';
import { Button } from '../../src/components/Button/Button';
import { ButtonVariant } from '../../src/components/Button/styles';

const THEME_HOST_STYLE = {
  '--mz-primary': '214 84% 42%',
  '--mz-primary-foreground': '0 0% 100%',
  '--mz-destructive': '0 76% 47%',
  '--mz-destructive-foreground': '0 0% 100%',
} as CSSProperties;

test.describe('Theme Styling (Component Test)', () => {
  test('checkbox accent follows theme primary token', async ({ mount }) => {
    const component = await mount(
      <div style={THEME_HOST_STYLE}>
        <Checkbox name="theme-checkbox" title="Enable alerts" />
      </div>,
    );

    const checkbox = component.locator('input[name="theme-checkbox"]');

    const initialAccent = await checkbox.evaluate(
      (node) => getComputedStyle(node as HTMLInputElement).accentColor,
    );

    await component.evaluate((host) => {
      (host as HTMLElement).style.setProperty('--mz-primary', '18 90% 42%');
    });

    const updatedAccent = await checkbox.evaluate(
      (node) => getComputedStyle(node as HTMLInputElement).accentColor,
    );

    expect(updatedAccent).not.toBe(initialAccent);
  });

  test('button variants apply distinct visual styles', async ({ mount }) => {
    const component = await mount(
      <div style={THEME_HOST_STYLE}>
        <div className="flex gap-2">
          <Button label="Primary" variant={ButtonVariant.Primary} />
          <Button label="Outlined" variant={ButtonVariant.Outlined} />
          <Button label="Dashed" variant={ButtonVariant.Dashed} />
          <Button label="Destructive" variant={ButtonVariant.Destructive} />
        </div>
      </div>,
    );

    const primary = component.getByRole('button', { name: 'Primary' });
    const outlined = component.getByRole('button', { name: 'Outlined' });
    const dashed = component.getByRole('button', { name: 'Dashed' });
    const destructive = component.getByRole('button', { name: 'Destructive' });

    const primaryBgImage = await primary.evaluate(
      (node) => getComputedStyle(node).backgroundImage,
    );
    const outlinedBg = await outlined.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );
    const destructiveClasses = await destructive.evaluate(
      (node) => node.className,
    );
    const dashedBorderStyle = await dashed.evaluate(
      (node) => getComputedStyle(node).borderStyle,
    );

    expect(primaryBgImage).not.toBe('none');
    expect(outlinedBg).toBe('rgba(0, 0, 0, 0)');
    expect(destructiveClasses).toContain('bg-destructive');
    expect(dashedBorderStyle).toBe('dashed');
  });

  test('unchecked checkbox outline remains visible on light and dark surfaces', async ({
    mount,
  }) => {
    const component = await mount(
      <div className="flex gap-6">
        <div
          style={
            {
              '--mz-background': '0 0% 100%',
              '--mz-input': '220 15% 70%',
              '--mz-foreground': '220 20% 12%',
            } as CSSProperties
          }
        >
          <Checkbox name="checkbox-light" title="Light" />
        </div>
        <div
          className="dark"
          style={
            {
              '--mz-background': '222 30% 10%',
              '--mz-input': '222 20% 35%',
              '--mz-foreground': '210 25% 96%',
            } as CSSProperties
          }
        >
          <Checkbox name="checkbox-dark" title="Dark" />
        </div>
      </div>,
    );

    const lightCheckbox = component.locator('input[name="checkbox-light"]');
    const lightStyle = await lightCheckbox.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLInputElement);
      return {
        borderColor: computed.borderColor,
        backgroundColor: computed.backgroundColor,
        borderWidth: computed.borderWidth,
      };
    });

    expect(lightStyle.borderWidth).toBe('2px');
    expect(lightStyle.borderColor).not.toBe(lightStyle.backgroundColor);

    const darkCheckbox = component.locator('input[name="checkbox-dark"]');
    const darkStyle = await darkCheckbox.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLInputElement);
      return {
        borderColor: computed.borderColor,
        backgroundColor: computed.backgroundColor,
        borderWidth: computed.borderWidth,
      };
    });

    expect(darkStyle.borderWidth).toBe('2px');
    expect(darkStyle.borderColor).not.toBe(darkStyle.backgroundColor);
  });
});
