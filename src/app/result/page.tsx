'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/common'
import { ConfettiLayer } from '@/components/common/ConfettiLayer'
import { useCountUp } from '@/hooks/useCountUp'
import Header from '@/components/common/Header'
import { getSession } from '@/lib/api/session'

const SPARK_DATA = [110, 132, 128, 145, 138, 142, 150, 144, 148, 155, 162, 158, 140, 152, 160]

type DeltaProps = {
  value: number
  suffix?: string
  type?: 'up-good' | 'down-good'
}

const Delta = ({ value, suffix = '', type = 'up-good' }: DeltaProps) => {
  const isUpGood = type === 'up-good'
  const better = isUpGood ? value > 0 : value > 0
  const flat = value === 0
  const arrow = flat ? '—' : better ? '↑' : '↓'

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono border ${
      flat ? 'text-[var(--fg-4)] bg-[var(--paper-2)] border-[var(--rule)]' :
      better ? 'text-[var(--good)] bg-[var(--good-wash)] border-[var(--good)]/30' :
      'text-[var(--bad)] bg-[var(--paper-2)] border-[var(--rule)]'
    }`}>
      <span className="text-xs">{arrow}</span>
      <span>{Math.abs(value)}{suffix}</span>
    </div>
  )
}

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const ResultContent = () => {
  const searchParams = useSearchParams()

  const cpm = parseInt(searchParams.get('cpm') || '142')
  const accuracy = parseInt(searchParams.get('accuracy') || '96')
  const timeElapsed = parseInt(searchParams.get('time') || '83')
  const errors = parseInt(searchParams.get('errors') || '6')
  const totalKeys = parseInt(searchParams.get('totalKeys') || '158')
  const chars = parseInt(searchParams.get('chars') || '152')
  const language = searchParams.get('lang') || 'python'
  const difficulty = searchParams.get('diff') || 'beginner'
  const sessionId = searchParams.get('sessionId')

  // 세션 데이터 조회 (sessionId 있을 때만)
  const { data: sessionData } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
  })

  const aiFeedback = sessionData?.ai_feedback ?? null
  const weakPatterns = sessionData?.weak_patterns ?? null

  // Mock previous best data
  const previousBest = { cpm: 138, accuracy: 97, timeSec: 79 }
  const previousSession = { cpm: 124, accuracy: 92, timeSec: 91 }

  // Calculate deltas
  const dCpm = cpm - previousSession.cpm
  const dAcc = accuracy - previousSession.accuracy
  const dTime = previousSession.timeSec - timeElapsed

  // Check if new best
  const isNewBest = cpm > previousBest.cpm

  // Mock consistency data
  const consistency = useMemo(() => {
    const mean = SPARK_DATA.reduce((a, b) => a + b, 0) / SPARK_DATA.length
    const variance = SPARK_DATA.reduce((a, b) => a + (b - mean) ** 2, 0) / SPARK_DATA.length
    const stddev = Math.sqrt(variance)
    return Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100 * 1.2)))
  }, [])

  // Animated counters
  const animatedCpm = useCountUp(cpm, 900)
  const animatedAcc = useCountUp(accuracy, 900)
  const animatedTime = useCountUp(timeElapsed, 900)
  const animatedConsistency = useCountUp(consistency, 900)

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--fg-1)] font-[var(--font-sans)]">
      <Header />
      <div className="h-screen grid grid-rows-[1fr_24px] overflow-hidden">
      {/* Titlebar */}
      <div className="flex items-center bg-[var(--ink)] border-b border-[var(--rule)] px-3 font-[var(--font-mono)] text-xs text-[var(--fg-3)] select-none">
        <div className="flex gap-1.5 pr-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--bad)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--warn)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--good)]" />
        </div>
        <div className="flex h-full">
          <div className="flex items-center gap-1.5 px-3 border-r border-[var(--rule)] text-[var(--fg-1)] bg-[var(--paper)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--good)]" />
            <span>codebeat — result</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="overflow-auto relative">
        {/* Background Rules */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--rule) 1px, transparent 1px)',
            backgroundSize: '80px 100%',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent 90%)'
          }}
        />

        {/* Confetti */}
        {isNewBest && <ConfettiLayer />}

        <div className="max-w-[880px] mx-auto px-8 py-9 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3.5 font-[var(--font-mono)] text-xs text-[var(--accent)] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--good)] animate-pulse" />
              <span>&gt; session complete</span>
            </div>
            <h1 className="text-4xl font-light leading-tight text-[var(--fg-1)] mb-4 tracking-tight">
              <span className="text-[var(--fg-3)]">잘했어요.</span>{' '}
              <span>오늘도 한 줄 더.</span>
            </h1>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-[var(--rule)] rounded-full bg-[var(--paper-2)] font-[var(--font-mono)] text-xs text-[var(--fg-3)]">
              <span><b className="text-[var(--fg-1)] font-medium">practice.{language}</b></span>
              <span className="text-[var(--fg-5)]">·</span>
              <span className="text-[var(--accent)]">{language}</span>
              <span className="text-[var(--fg-5)]">·</span>
              <span>{difficulty}</span>
              <span className="text-[var(--fg-5)]">·</span>
              <span>{new Date().toISOString().slice(0, 10)}</span>
            </div>
          </div>

          {/* Hero Metrics */}
          <div className="grid grid-cols-3 gap-0 border-t border-b border-[var(--rule)] py-8 relative mb-5">
            {/* Accent lines */}
            <div className="absolute -top-1 left-0 w-px h-2 bg-[var(--accent)]" />
            <div className="absolute -bottom-1 left-0 w-px h-2 bg-[var(--accent)]" />

            {/* CPM */}
            <div className="text-center px-4 border-r border-[var(--rule)] relative">
              {isNewBest && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[var(--good)] text-[var(--accent-ink)] px-2 py-0.5 rounded text-[10px] font-[var(--font-mono)] font-semibold tracking-wider uppercase">
                  new best
                </div>
              )}
              <div className="font-[var(--font-mono)] text-[92px] font-light leading-none text-[var(--accent)] tracking-tighter">
                {animatedCpm}
              </div>
              <Delta value={dCpm} type="up-good" />
              <div className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] uppercase text-[var(--fg-4)] mt-3.5">cpm</div>
              <div className="font-[var(--font-mono)] text-[11px] text-[var(--fg-5)] mt-1">
                last <b className="text-[var(--fg-3)] font-medium">{previousSession.cpm}</b>
              </div>
            </div>

            {/* Accuracy */}
            <div className="text-center px-4 border-r border-[var(--rule)]">
              <div className="font-[var(--font-mono)] text-[92px] font-light leading-none text-[var(--fg-1)] tracking-tighter flex items-baseline justify-center">
                <span>{animatedAcc}</span>
                <span className="text-2xl text-[var(--fg-3)] ml-1">%</span>
              </div>
              <Delta value={dAcc} suffix="%" type="up-good" />
              <div className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] uppercase text-[var(--fg-4)] mt-3.5">accuracy</div>
              <div className="font-[var(--font-mono)] text-[11px] text-[var(--fg-5)] mt-1">
                last <b className="text-[var(--fg-3)] font-medium">{previousSession.accuracy}%</b>
              </div>
            </div>

            {/* Time */}
            <div className="text-center px-4">
              <div className="font-[var(--font-mono)] text-[92px] font-light leading-none text-[var(--fg-1)] tracking-tighter">
                {formatTime(animatedTime)}
              </div>
              <Delta value={dTime} type="down-good" />
              <div className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] uppercase text-[var(--fg-4)] mt-3.5">time</div>
              <div className="font-[var(--font-mono)] text-[11px] text-[var(--fg-5)] mt-1">
                last <b className="text-[var(--fg-3)] font-medium">{formatTime(previousSession.timeSec)}</b>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-4 gap-0 py-3.5 mb-7 border-b border-[var(--rule)]">
            <div className="text-center px-3 border-r border-[var(--rule)]">
              <div className="font-[var(--font-mono)] text-[22px] font-medium text-[var(--fg-1)] leading-tight">{chars}</div>
              <div className="font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--fg-4)] mt-1.5">chars typed</div>
            </div>
            <div className="text-center px-3 border-r border-[var(--rule)]">
              <div className="font-[var(--font-mono)] text-[22px] font-medium text-[var(--fg-1)] leading-tight">{totalKeys}</div>
              <div className="font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--fg-4)] mt-1.5">keystrokes</div>
            </div>
            <div className="text-center px-3 border-r border-[var(--rule)]">
              <div className="font-[var(--font-mono)] text-[22px] font-medium text-[var(--fg-1)] leading-tight">{errors}</div>
              <div className="font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--fg-4)] mt-1.5">errors</div>
            </div>
            <div className="text-center px-3">
              <div className="font-[var(--font-mono)] text-[22px] font-medium text-[var(--fg-1)] leading-tight">
                {animatedConsistency}
                <span className="text-sm text-[var(--fg-4)]">%</span>
              </div>
              <div className="font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--fg-4)] mt-1.5">consistency</div>
            </div>
          </div>

          {/* Consistency Sparkline */}
          <div className="flex items-center gap-4 mb-6 p-3 border border-[var(--rule)] bg-[var(--paper-2)] rounded-lg">
            <div className="font-[var(--font-mono)] text-[11px] tracking-[0.14em] uppercase text-[var(--fg-4)] min-w-[110px]">
              pace · per line
            </div>
            <div className="flex-1 flex gap-0.5 items-end h-7">
              {SPARK_DATA.map((value, i) => {
                const maxValue = Math.max(...SPARK_DATA)
                const height = Math.max(2, Math.round(value / maxValue * 28))
                const tone = value >= 140 ? 'good' : value >= 110 ? 'warn' : 'bad'
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm min-w-1 ${
                      tone === 'good' ? 'bg-[var(--good)] opacity-85' :
                      tone === 'warn' ? 'bg-[var(--warn)] opacity-85' :
                      'bg-[var(--bad)] opacity-85'
                    }`}
                    style={{ height }}
                  />
                )
              })}
            </div>
            <div className="font-[var(--font-mono)] text-xs text-[var(--fg-2)] min-w-[8ch] text-right">
              avg <b className="text-[var(--accent)] font-semibold">{Math.round(SPARK_DATA.reduce((a, b) => a + b, 0) / SPARK_DATA.length)}</b>
            </div>
          </div>

          {/* AI 피드백 */}
          {(aiFeedback || weakPatterns) && (
            <div className="mb-6 p-4 border border-[var(--accent)]/20 bg-[var(--accent)]/5 rounded-lg">
              <div className="font-[var(--font-mono)] text-[11px] tracking-[0.14em] uppercase text-[var(--accent)] mb-3">
                AI 분석
              </div>
              {aiFeedback && (
                <p className="text-sm text-[var(--fg-2)] leading-relaxed mb-3">{aiFeedback}</p>
              )}
              {weakPatterns && weakPatterns.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {weakPatterns.map((wp, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--bad)]/10 border border-[var(--bad)]/20 rounded font-[var(--font-mono)] text-xs"
                    >
                      <span className="text-[var(--bad)] font-medium">{wp.pattern}</span>
                      <span className="text-[var(--fg-4)]">{Math.round(wp.error_rate * 100)}% 오류</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2.5">
            <Link href="/practice" className="flex-1">
              <Button variant="secondary" className="w-full text-sm font-[var(--font-mono)] font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2.5 7 A 4 4 0 1 0 4.7 3.5"/>
                  <path d="M5 1 L5 4 L2 4"/>
                </svg>
                다시 연습
                <kbd className="ml-auto px-1.5 py-0.5 text-[10.5px] border border-current rounded opacity-60">⏎</kbd>
              </Button>
            </Link>
            <Link href="/ranking" className="flex-1">
              <Button variant="secondary" className="w-full text-sm font-[var(--font-mono)] font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2.5 12 L11.5 12"/>
                  <rect x="3" y="6" width="2.5" height="4.5"/>
                  <rect x="6" y="3" width="2.5" height="7.5"/>
                  <rect x="9" y="7.5" width="2.5" height="3"/>
                </svg>
                랭킹 보기
                <kbd className="ml-auto px-1.5 py-0.5 text-[10.5px] border border-current rounded opacity-60">R</kbd>
              </Button>
            </Link>
            <Link href="/setup" className="flex-1">
              <Button variant="primary" className="w-full text-sm font-[var(--font-mono)] font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 1 L12 7 L3 13 Z"/>
                </svg>
                다음 예제
                <kbd className="ml-auto px-1.5 py-0.5 text-[10.5px] border border-current rounded opacity-60">→</kbd>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statusbar */}
      <div className="bg-[var(--good)] text-[var(--accent-ink)] flex items-center font-[var(--font-mono)] text-xs px-3">
        <div className="flex items-center gap-1.5 px-3 h-full border-r border-black/15">
          <span>✓ logged</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 h-full border-r border-black/15">
          <span>{language}.{difficulty}.cpm · {cpm}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 h-full border-r border-black/15">
          <span>{isNewBest ? 'personal best updated' : `${previousBest.cpm - cpm} cpm to beat your best`}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 h-full ml-auto border-l border-black/15">
          <span>session #2,847</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 h-full border-l border-black/15">
          <span>UTF-8 · LF</span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <ResultContent />
    </Suspense>
  )
}
