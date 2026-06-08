import { componentClasses } from '@/lib/design-utils'
import type { Language, Difficulty } from '@/types/practice'

export type StatusbarProps = {
  lang: Language | null
  diff: Difficulty | null
  ready: boolean
  className?: string
}

export const Statusbar = ({ lang, diff, ready, className }: StatusbarProps) => {
  const baseClass = componentClasses.statusbar
  const stateClass = ready
    ? 'bg-[var(--paper-2)] text-[var(--fg-2)] border-t border-[var(--rule-2)]'
    : 'bg-[var(--paper-2)] text-[var(--fg-3)] border-t border-[var(--rule)]'

  return (
    <div className={`${baseClass} ${stateClass} ${className || ''}`} role="status">
      <StatusSegment>
        <span className={`w-1.5 h-1.5 rounded-full ${
          ready ? 'bg-[var(--fg-2)]' : 'bg-[var(--fg-4)]'
        }`} />
        <span>{ready ? 'READY' : 'SELECT'}</span>
      </StatusSegment>

      <StatusSegment>
        <span>{lang ? `${lang.name.toLowerCase()}.${lang.ext}` : 'no file'}</span>
      </StatusSegment>

      <StatusSegment>
        <span>{diff ? diff.en : 'no difficulty'}</span>
      </StatusSegment>

      {diff && (
        <StatusSegment>
          <span>est. {diff.minutes}m · {diff.target}</span>
        </StatusSegment>
      )}

      <StatusSegment push>
        <span>UTF-8</span>
      </StatusSegment>

      <StatusSegment>
        <span>LF</span>
      </StatusSegment>

      <StatusSegment>
        <span>v1.0.0</span>
      </StatusSegment>
    </div>
  )
}

type StatusSegmentProps = {
  children: React.ReactNode
  push?: boolean
}

const StatusSegment = ({ children, push = false }: StatusSegmentProps) => {
  const baseClass = 'flex items-center gap-1.5 px-3 h-full'
  const borderClass = push
    ? 'border-l border-black/15 ml-auto'
    : 'border-r border-black/15'

  return (
    <div className={`${baseClass} ${borderClass}`}>
      {children}
    </div>
  )
}