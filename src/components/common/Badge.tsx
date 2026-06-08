import { cn } from '@/lib/design-utils'

export type BadgeProps = {
  children: React.ReactNode
  variant?: 'code' | 'label' | 'step'
  className?: string
}

export const Badge = ({ children, variant = 'label', className }: BadgeProps) => {
  const baseClasses = 'font-mono text-xs px-1.5 py-0.5 rounded border'

  const variantClasses = {
    code: 'border-[var(--rule-2)] bg-[var(--paper-2)] text-[var(--fg-2)]',
    label: 'border-[var(--rule-2)] bg-[var(--paper-2)] text-[var(--fg-3)]',
    step: 'border-transparent bg-transparent text-[var(--accent)] font-semibold',
  }

  return (
    <kbd className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </kbd>
  )
}