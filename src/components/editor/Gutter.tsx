import { componentClasses } from '@/lib/design-utils'

export type GutterProps = {
  rows?: number
  focusLine?: number | null
  className?: string
}

export const Gutter = ({ rows = 48, focusLine, className }: GutterProps) => {
  const lines = Array.from({ length: rows }, (_, i) => i + 1)

  return (
    <div className={`${componentClasses.gutter} ${className || ''}`}>
      {lines.map(n => (
        <div key={n} className={n === focusLine ? 'text-[var(--fg-2)]' : ''}>
          {n}
        </div>
      ))}
    </div>
  )
}