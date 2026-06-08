import { forwardRef } from 'react'
import { cn, componentClasses } from '@/lib/design-utils'

export type ButtonVariant = 'primary' | 'secondary'

export type ButtonProps = {
  variant?: ButtonVariant
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  keyboard?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', disabled, children, onClick, className, icon, keyboard, ...props }, ref) => {
    const baseClass = variant === 'primary'
      ? componentClasses.button.primary
      : componentClasses.button.secondary

    return (
      <button
        ref={ref}
        className={cn(baseClass, className)}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
        <span>{children}</span>
        {keyboard && !disabled && (
          <kbd className="ml-auto font-mono text-xs border border-current px-1.5 py-0.5 rounded opacity-75">
            {keyboard}
          </kbd>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'