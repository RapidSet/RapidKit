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

  test('checkbox keeps a visible circular border across themed surfaces', async ({
    mount,
  }) => {
    const component = await mount(
      <div className="flex gap-6">
        <div
          style={
            {
              '--mz-control-border': '210 10% 30% / 0.45',
            } as CSSProperties
          }
        >
          <Checkbox name="theme-border-checkbox-a" title="Border token A" />
        </div>
        <div
          style={
            {
              '--mz-control-border': '24 90% 42% / 0.6',
            } as CSSProperties
          }
        >
          <Checkbox name="theme-border-checkbox-b" title="Border token B" />
        </div>
      </div>,
    );

    const checkboxA = component.locator(
      'input[name="theme-border-checkbox-a"]',
    );
    const checkboxB = component.locator(
      'input[name="theme-border-checkbox-b"]',
    );

    const borderA = await checkboxA.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLInputElement);
      return {
        borderWidth: computed.borderWidth,
        borderRadius: computed.borderRadius,
        borderColor: computed.borderColor,
        backgroundColor: computed.backgroundColor,
      };
    });

    const borderB = await checkboxB.evaluate((node) => {
      const computed = getComputedStyle(node as HTMLInputElement);
      return {
        borderWidth: computed.borderWidth,
        borderRadius: computed.borderRadius,
        borderColor: computed.borderColor,
        backgroundColor: computed.backgroundColor,
      };
    });

    expect(borderA.borderWidth).toBe('1px');
    expect(borderA.borderRadius).not.toBe('0px');
    expect(borderA.borderColor).not.toBe(borderA.backgroundColor);

    expect(borderB.borderWidth).toBe('1px');
    expect(borderB.borderRadius).not.toBe('0px');
    expect(borderB.borderColor).not.toBe(borderB.backgroundColor);
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

    const primaryBg = await primary.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
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

    expect(primaryBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(outlinedBg).toBe('rgba(0, 0, 0, 0)');
    expect(destructiveClasses).toContain('bg-destructive');
    expect(dashedBorderStyle).toBe('dashed');
  });

  test('primary and destructive buttons have visible resting borders', async ({
    mount,
  }) => {
    const component = await mount(
      <div style={THEME_HOST_STYLE}>
        <div className="flex gap-2">
          <Button label="Primary Border" variant={ButtonVariant.Primary} />
          <Button
            label="Destructive Border"
            variant={ButtonVariant.Destructive}
          />
        </div>
      </div>,
    );

    const primary = component.getByRole('button', { name: 'Primary Border' });
    const destructive = component.getByRole('button', {
      name: 'Destructive Border',
    });

    const primaryBorder = await primary.evaluate((node) => {
      const computed = getComputedStyle(node);
      return {
        borderWidth: computed.borderWidth,
        borderColor: computed.borderColor,
      };
    });

    const destructiveBorder = await destructive.evaluate((node) => {
      const computed = getComputedStyle(node);
      return {
        borderWidth: computed.borderWidth,
        borderColor: computed.borderColor,
      };
    });

    expect(primaryBorder.borderWidth).toBe('1px');
    expect(primaryBorder.borderColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(destructiveBorder.borderWidth).toBe('1px');
    expect(destructiveBorder.borderColor).not.toBe('rgba(0, 0, 0, 0)');
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

    expect(lightStyle.borderWidth).toBe('1px');
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

    expect(darkStyle.borderWidth).toBe('1px');
    expect(darkStyle.borderColor).not.toBe(darkStyle.backgroundColor);
  });
});
