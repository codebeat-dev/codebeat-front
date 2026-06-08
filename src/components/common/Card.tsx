import { forwardRef } from 'react'
import { cn, componentClasses } from '@/lib/design-utils'

export type CardVariant = 'language' | 'difficulty'

export type CardProps = {
  variant: CardVariant
  selected?: boolean
  onSelect?: () => void
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Card = forwardRef<HTMLButtonElement, CardProps>(
  ({ variant, selected = false, onSelect, children, className, ...props }, ref) => {
    const baseClass = variant === 'language'
      ? componentClasses.card.language
      : componentClasses.card.difficulty

    const selectedClass = selected
      ? 'border-[var(--accent)] bg-[var(--accent-wash)]'
      : ''

    return (
      <button
        ref={ref}
        type="button"
        className={cn(baseClass, selectedClass, className)}
        onClick={onSelect}
        aria-pressed={selected}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Card.displayName = 'Card'

// Card sub-components for better composition
export const CardTopStripe = ({ visible }: { visible: boolean }) => (
  visible ? (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
  ) : null
)

export const CardCheckbox = ({ checked }: { checked: boolean }) => (
  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border border-[var(--rule-2)] flex items-center justify-center transition-all">
    {checked && (
      <div className="w-4 h-4 rounded-full bg-[var(--accent)] border-[var(--accent)] flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8.5L6.5 12L13 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-[var(--accent-ink)]"
          />
        </svg>
      </div>
    )}
  </div>
)