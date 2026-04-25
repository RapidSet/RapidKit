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
        sans: ['var(--rk-font-sans)'],
        mono: ['var(--rk-font-mono)'],
      },
      colors: {
        border: 'hsl(var(--rk-border))',
        input: 'hsl(var(--rk-input))',
        ring: 'hsl(var(--rk-ring))',
        background: 'hsl(var(--rk-background))',
        foreground: 'hsl(var(--rk-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--rk-primary))',
          foreground: 'hsl(var(--rk-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--rk-secondary))',
          foreground: 'hsl(var(--rk-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--rk-destructive))',
          foreground: 'hsl(var(--rk-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--rk-muted))',
          foreground: 'hsl(var(--rk-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--rk-accent))',
          foreground: 'hsl(var(--rk-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--rk-popover))',
          foreground: 'hsl(var(--rk-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--rk-card))',
          foreground: 'hsl(var(--rk-card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--rk-radius)',
        md: 'calc(var(--rk-radius) - 2px)',
        sm: 'calc(var(--rk-radius) - 4px)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
