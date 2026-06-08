import type { ColorToken } from './design-tokens'

/**
 * Design System Utilities
 */

// Generate className for Tailwind using design tokens
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Color utility functions
export const getColorVar = (token: ColorToken): string => {
  return `var(--${token.replace(/([A-Z])/g, '-$1').toLowerCase()})`
}

// Generate Tailwind-compatible color classes
export const colorClasses = {
  // Backgrounds
  bg: {
    ink: 'bg-[var(--ink)]',
    paper: 'bg-[var(--paper)]',
    paper2: 'bg-[var(--paper-2)]',
    paper3: 'bg-[var(--paper-3)]',
    accent: 'bg-[var(--accent)]',
    accentWash: 'bg-[var(--accent-wash)]',
  },

  // Text colors
  text: {
    fg1: 'text-[var(--fg-1)]',
    fg2: 'text-[var(--fg-2)]',
    fg3: 'text-[var(--fg-3)]',
    fg4: 'text-[var(--fg-4)]',
    fg5: 'text-[var(--fg-5)]',
    accent: 'text-[var(--accent)]',
    accent2: 'text-[var(--accent-2)]',
    accentInk: 'text-[var(--accent-ink)]',
  },

  // Borders
  border: {
    rule: 'border-[var(--rule)]',
    rule2: 'border-[var(--rule-2)]',
    accent: 'border-[var(--accent)]',
  }
} as const

// Component state classes
export const stateClasses = {
  hover: {
    paper3: 'hover:bg-[var(--paper-3)]',
    rule2: 'hover:border-[var(--rule-2)]',
    accent2: 'hover:bg-[var(--accent-2)]',
  },
  focus: {
    accent: 'focus:border-[var(--accent)] focus:ring-[var(--accent)]/25',
  },
  disabled: {
    bg: 'disabled:bg-[var(--paper-3)]',
    text: 'disabled:text-[var(--fg-4)]',
    border: 'disabled:border-[var(--rule)]',
  }
} as const

// Typography classes
export const fontClasses = {
  sans: 'font-[var(--font-sans)]',
  mono: 'font-[var(--font-mono)]',
} as const

// Pre-built component classes
export const componentClasses = {
  // Button variants
  button: {
    primary: cn(
      'flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg',
      'font-mono font-semibold text-sm tracking-wide cursor-pointer transition-all',
      colorClasses.bg.accent,
      colorClasses.text.accentInk,
      colorClasses.border.accent,
      stateClasses.hover.accent2,
      'active:translate-y-0.5',
      stateClasses.disabled.bg,
      stateClasses.disabled.text,
      stateClasses.disabled.border,
      'disabled:cursor-not-allowed'
    ),
    secondary: cn(
      'flex items-center gap-2 py-3.5 px-4 rounded-lg border cursor-pointer transition-all',
      'font-mono text-sm bg-transparent',
      colorClasses.border.rule2,
      colorClasses.text.fg2,
      stateClasses.hover.paper3,
      'hover:text-[var(--fg-1)]'
    )
  },

  // Card variants
  card: {
    language: cn(
      'relative flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all',
      'text-left overflow-hidden',
      colorClasses.bg.paper2,
      colorClasses.border.rule,
      colorClasses.text.fg1,
      stateClasses.hover.rule2,
      stateClasses.hover.paper3,
      stateClasses.focus.accent
    ),
    difficulty: cn(
      'relative flex flex-col gap-1 p-3.5 rounded-lg border cursor-pointer transition-all',
      'text-left',
      colorClasses.bg.paper2,
      colorClasses.border.rule,
      colorClasses.text.fg1,
      stateClasses.hover.paper3,
      stateClasses.hover.rule2
    )
  },

  // Layout components
  gutter: cn(
    'border-r font-mono text-xs text-right pr-2.5 pt-4 leading-[1.65] select-none overflow-hidden',
    colorClasses.border.rule,
    colorClasses.bg.paper,
    colorClasses.text.fg5
  ),

  statusbar: cn(
    'flex items-center font-mono text-xs px-3 gap-0 select-none h-6'
  ),

  titlebar: cn(
    'flex items-center border-b px-3 gap-4 font-mono text-xs select-none',
    colorClasses.bg.ink,
    colorClasses.border.rule,
    colorClasses.text.fg3
  ),
} as const

// Animation classes
export const animations = {
  blink: 'animate-pulse',
  pulse: 'animate-pulse',
} as const

// Responsive utilities
export const responsive = {
  mobile: {
    langGrid: 'max-md:grid-cols-2 max-md:[&>:nth-child(5)]:col-span-2',
    diffGrid: 'max-md:grid-cols-1',
    gutter: 'max-md:grid-cols-[32px_1fr]',
  }
} as const
