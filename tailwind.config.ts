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
          2: 'hsl(var(--rk-accent-2))',
          '2-foreground': 'hsl(var(--rk-accent-2-foreground))',
          3: 'hsl(var(--rk-accent-3))',
          '3-foreground': 'hsl(var(--rk-accent-3-foreground))',
          4: 'hsl(var(--rk-accent-4))',
          '4-foreground': 'hsl(var(--rk-accent-4-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--rk-popover))',
          foreground: 'hsl(var(--rk-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--rk-card))',
          foreground: 'hsl(var(--rk-card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--rk-success))',
          foreground: 'hsl(var(--rk-success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--rk-warning))',
          foreground: 'hsl(var(--rk-warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--rk-info))',
          foreground: 'hsl(var(--rk-info-foreground))',
        },
        chart: {
          1: 'hsl(var(--rk-chart-1))',
          2: 'hsl(var(--rk-chart-2))',
          3: 'hsl(var(--rk-chart-3))',
          4: 'hsl(var(--rk-chart-4))',
          5: 'hsl(var(--rk-chart-5))',
          6: 'hsl(var(--rk-chart-6))',
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
      borderWidth: {
        DEFAULT: 'var(--rk-border-width)',
      },
      boxShadow: {
        xs: 'var(--rk-shadow-xs)',
        sm: 'var(--rk-shadow-sm)',
        DEFAULT: 'var(--rk-shadow-sm)',
        md: 'var(--rk-shadow-md)',
        lg: 'var(--rk-shadow-lg)',
        xl: 'var(--rk-shadow-xl)',
      },
      transitionDuration: {
        fast: 'var(--rk-motion-fast)',
        base: 'var(--rk-motion-base)',
        slow: 'var(--rk-motion-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--rk-ease-standard)',
        emphasized: 'var(--rk-ease-emphasized)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
