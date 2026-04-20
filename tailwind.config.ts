import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx,md,mdx}',
    './docs-nextra/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--mz-font-sans)'],
        mono: ['var(--mz-font-mono)'],
      },
      colors: {
        border: 'hsl(var(--mz-border))',
        input: 'hsl(var(--mz-input))',
        ring: 'hsl(var(--mz-ring))',
        background: 'hsl(var(--mz-background))',
        foreground: 'hsl(var(--mz-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--mz-primary))',
          foreground: 'hsl(var(--mz-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--mz-secondary))',
          foreground: 'hsl(var(--mz-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--mz-destructive))',
          foreground: 'hsl(var(--mz-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--mz-muted))',
          foreground: 'hsl(var(--mz-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--mz-accent))',
          foreground: 'hsl(var(--mz-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--mz-popover))',
          foreground: 'hsl(var(--mz-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--mz-card))',
          foreground: 'hsl(var(--mz-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--mz-radius)',
        md: 'calc(var(--mz-radius) - 2px)',
        sm: 'calc(var(--mz-radius) - 4px)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
