export type IconProps = {
  className?: string
  size?: number
}

export const PlayIcon = ({ className, size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor" className={className}>
    <path d="M2 1 L11 6 L2 11 Z" />
  </svg>
)

export const CheckIcon = ({ className, size = 10 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path
      d="M3 8.5L6.5 12L13 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const QuestionIcon = ({ className, size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </svg>
)

export const CloseIcon = ({ className, size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const DotIcon = ({ className, size = 6 }: IconProps) => (
  <span className={`w-${size/4} h-${size/4} rounded-full bg-current ${className}`} />
)

// Traffic light icons for macOS-style window controls
export const TrafficLights = ({ className }: { className?: string }) => (
  <div className={`flex gap-1.5 ${className}`}>
    <span className="w-3 h-3 rounded-full bg-[var(--bad)]" />
    <span className="w-3 h-3 rounded-full bg-[var(--warn)]" />
    <span className="w-3 h-3 rounded-full bg-[var(--good)]" />
  </div>
)