/**
 * CodeBeat Design System Tokens
 * Dark editor theme with CodeBeat brand color tokens.
 */

export const colors = {
  // Background Layers
  ink: '#0B0D11',        // deepest bg
  paper: '#10131A',      // base canvas
  paper2: '#161A23',     // elevated
  paper3: '#1C2230',     // hovered

  // Borders
  rule: '#232938',       // hairline
  rule2: '#2E3548',      // stronger hairline

  // Text Colors
  fg1: '#E8E8E2',        // primary text
  fg2: '#B5B7BD',        // secondary
  fg3: '#7A7E89',        // muted
  fg4: '#525663',        // gutter / disabled
  fg5: '#363B48',        // almost-bg

  // CodeBeat Brand Palette
  primary50: '#EEEDFE',
  primary100: '#CECBF6',
  primary200: '#AFA9EC',
  primary400: '#7F77DD',
  primary600: '#534AB7',
  primary800: '#3C3489',
  primary900: '#26215C',

  brandAccent50: '#E1F5EE',
  brandAccent100: '#9FE1CB',
  brandAccent200: '#5DCAA5',
  brandAccent400: '#1D9E75',
  brandAccent600: '#0F6E56',
  brandAccent800: '#085041',
  brandAccent900: '#04342C',

  semanticError50: '#FCEBEB',
  semanticError400: '#E24B4A',
  semanticWarning400: '#BA7517',
  semanticNeutral50: '#F1EFE8',
  semanticNeutral400: '#888780',

  // Accent Colors
  accent: '#534AB7',     // main CTA / link
  accent2: '#7F77DD',    // icon / secondary emphasis
  accentWash: 'rgba(83,74,183,0.14)',
  accentInk: '#0B0D11',  // accent contrast

  // Semantic Colors
  good: '#1D9E75',       // success / CPM
  warn: '#BA7517',       // slow speed warning
  bad: '#E24B4A',        // typing error

  // Syntax Highlighting
  synKey: '#7F77DD',
  synStr: '#1D9E75',
  synFn: '#5DCAA5',
  synCom: '#888780',
  synNum: '#BA7517',
  synType: '#AFA9EC',
  synOp: '#CECBF6',
  synParam: '#9FE1CB',
  synBuiltin: '#AFA9EC',
  synPunct: '#B5B7BD',   // punctuation gray

  // Error states
  badWash: 'rgba(226,75,74,0.18)',
  badLine: 'rgba(226,75,74,0.10)',

  // macOS Traffic Lights
  trafficRed: '#E24B4A',
  trafficYellow: '#BA7517',
  trafficGreen: '#1D9E75',
} as const

export const typography = {
  fontSans: "'Pretendard', system-ui, -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const

export const spacing = {
  xs: '0.125rem',    // 2px
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
} as const

export const borderRadius = {
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  full: '9999px',
} as const

export const shadows = {
  focus: '0 0 0 3px rgba(83,74,183,0.25)',
} as const

// CSS Custom Properties (for use in Tailwind config or CSS)
export const cssVars = {
  // Background Layers
  '--cb-ink': colors.ink,
  '--cb-paper': colors.paper,
  '--cb-paper-2': colors.paper2,
  '--cb-paper-3': colors.paper3,

  // Borders
  '--cb-rule': colors.rule,
  '--cb-rule-2': colors.rule2,

  // Text Colors
  '--cb-fg-1': colors.fg1,
  '--cb-fg-2': colors.fg2,
  '--cb-fg-3': colors.fg3,
  '--cb-fg-4': colors.fg4,
  '--cb-fg-5': colors.fg5,

  // CodeBeat Brand Palette
  '--cb-primary-50': colors.primary50,
  '--cb-primary-100': colors.primary100,
  '--cb-primary-200': colors.primary200,
  '--cb-primary-400': colors.primary400,
  '--cb-primary-600': colors.primary600,
  '--cb-primary-800': colors.primary800,
  '--cb-primary-900': colors.primary900,
  '--cb-brand-accent-50': colors.brandAccent50,
  '--cb-brand-accent-100': colors.brandAccent100,
  '--cb-brand-accent-200': colors.brandAccent200,
  '--cb-brand-accent-400': colors.brandAccent400,
  '--cb-brand-accent-600': colors.brandAccent600,
  '--cb-brand-accent-800': colors.brandAccent800,
  '--cb-brand-accent-900': colors.brandAccent900,
  '--cb-semantic-error-50': colors.semanticError50,
  '--cb-semantic-error-400': colors.semanticError400,
  '--cb-semantic-warning-400': colors.semanticWarning400,
  '--cb-semantic-neutral-50': colors.semanticNeutral50,
  '--cb-semantic-neutral-400': colors.semanticNeutral400,

  // Accent Colors
  '--cb-accent': colors.accent,
  '--cb-accent-2': colors.accent2,
  '--cb-accent-wash': colors.accentWash,
  '--cb-accent-ink': colors.accentInk,

  // Semantic Colors
  '--cb-good': colors.good,
  '--cb-warn': colors.warn,
  '--cb-bad': colors.bad,

  // Typography
  '--cb-font-sans': typography.fontSans,
  '--cb-font-mono': typography.fontMono,
} as const

// Type definitions for design tokens
export type ColorToken = keyof typeof colors
export type TypographyToken = keyof typeof typography
export type SpacingToken = keyof typeof spacing
export type BorderRadiusToken = keyof typeof borderRadius

// Utility functions
export const getColor = (token: ColorToken) => colors[token]
export const getTypography = (token: TypographyToken) => typography[token]
export const getSpacing = (token: SpacingToken) => spacing[token]
export const getBorderRadius = (token: BorderRadiusToken) => borderRadius[token]

// Theme variants (for future extensibility)
export const themes = {
  dark: {
    colors,
    typography,
  }
} as const

export type Theme = typeof themes.dark
