import { componentClasses } from '@/lib/design-utils'

export type TitlebarProps = {
  title?: string
  tagline?: string
  statusLabel?: string
  statusValue?: string
  className?: string
}

export const Titlebar = ({
  title = 'CodeBeat',
  tagline = '코드를 치며 문법의 리듬을 익히는 타이핑 트레이너',
  statusLabel = 'current setup',
  statusValue,
  className
}: TitlebarProps) => {
  return (
    <header className={`${componentClasses.titlebar} ${className || ''}`}>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--accent)]">
            Practice Lab
          </span>
          <span className="font-[var(--font-mono)] text-[var(--fg-4)]">/</span>
          <span className="truncate font-semibold text-[var(--fg-1)]">{title}</span>
        </div>
        <p className="mt-1 truncate text-xs text-[var(--fg-3)]">{tagline}</p>
      </div>

      <div className="ml-auto hidden items-center gap-3 md:flex">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[var(--fg-4)]">
          {statusLabel}
        </span>
        <span className="rounded-full border border-[var(--rule-2)] bg-[var(--paper-2)] px-3 py-1 font-[var(--font-mono)] text-xs text-[var(--fg-2)]">
          {statusValue}
        </span>
      </div>
    </header>
  )
}
