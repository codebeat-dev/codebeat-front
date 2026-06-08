'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Header from '@/components/common/Header'
import { getSessions } from '@/lib/api/session'
import { useAuthStore } from '@/store/authStore'

const LANG_EXT: Record<string, string> = {
  Python: 'py', JavaScript: 'js', Java: 'java', C: 'c', SQL: 'sql',
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

// 미니 CPM 스파크라인 컴포넌트
type SparklineProps = { data: number[] }

const Sparkline = ({ data }: SparklineProps) => {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 28
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoggedIn, clearAuth } = useAuthStore()

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    enabled: isLoggedIn,
  })

  // CPM 추이 (최근 20개)
  const cpmHistory = useMemo(() =>
    (sessions ?? []).slice(0, 20).reverse().map(s => s.cpm),
  [sessions])

  // 언어별 베스트 CPM
  const bestByLang = useMemo(() => {
    const map: Record<string, number> = {}
    for (const s of sessions ?? []) {
      const lang = s.code_example_id // 실제론 language 필드 필요하나 일단 id 사용
      if (!map[lang] || s.cpm > map[lang]) map[lang] = s.cpm
    }
    return map
  }, [sessions])

  const totalSessions = sessions?.length ?? 0
  const bestCpm = sessions ? Math.max(0, ...sessions.map(s => s.cpm)) : 0
  const avgAccuracy = sessions?.length
    ? Math.round(sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length * 100)
    : 0

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--fg-1)] font-[var(--font-sans)]">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-[var(--fg-3)] font-[var(--font-mono)] mb-6">로그인이 필요합니다</p>
          <Link href="/login" className="px-5 py-2.5 bg-[var(--accent)] text-[var(--ink)] rounded-lg font-medium text-sm">
            로그인
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--fg-1)] font-[var(--font-sans)]">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 유저 정보 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] mb-1">
              <span className="text-[var(--syn-com)]">//</span> profile
            </div>
            <h1 className="text-3xl font-light text-[var(--fg-1)] tracking-tight">
              {user?.username}
            </h1>
            <p className="text-sm text-[var(--fg-4)] font-[var(--font-mono)] mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 border border-[var(--rule)] rounded-lg font-[var(--font-mono)] text-xs text-[var(--fg-3)] hover:border-[var(--bad)]/40 hover:text-[var(--bad)] transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* 요약 스탯 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'total sessions', value: totalSessions, suffix: '' },
            { label: 'best cpm', value: bestCpm, suffix: '' },
            { label: 'avg accuracy', value: avgAccuracy, suffix: '%' },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="border border-[var(--rule)] rounded-xl p-4 bg-[var(--paper-2)] text-center">
              <div className="font-[var(--font-mono)] text-2xl font-semibold text-[var(--fg-1)]">
                {value}{suffix}
              </div>
              <div className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)] mt-1.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CPM 성장 그래프 */}
        {cpmHistory.length >= 2 && (
          <div className="border border-[var(--rule)] rounded-xl p-5 bg-[var(--paper-2)] mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-[var(--font-mono)] text-[11px] tracking-widest uppercase text-[var(--fg-4)]">
                CPM 추이
              </div>
              <div className="font-[var(--font-mono)] text-xs text-[var(--fg-3)]">
                최근 {cpmHistory.length}회
              </div>
            </div>
            <div className="flex items-end gap-1 h-16">
              {cpmHistory.map((cpm, i) => {
                const max = Math.max(...cpmHistory)
                const min = Math.min(...cpmHistory)
                const range = max - min || 1
                const height = Math.max(4, Math.round(((cpm - min) / range) * 52) + 8)
                const isLast = i === cpmHistory.length - 1
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <div
                      className={`w-full rounded-sm transition-all ${
                        isLast ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]/30'
                      }`}
                      style={{ height }}
                      title={`${cpm} CPM`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between font-[var(--font-mono)] text-[10px] text-[var(--fg-5)] mt-2">
              <span>{Math.min(...cpmHistory)} CPM</span>
              <span>{Math.max(...cpmHistory)} CPM</span>
            </div>
          </div>
        )}

        {/* 연습 기록 */}
        <div className="border border-[var(--rule)] rounded-xl overflow-hidden bg-[var(--paper-2)]">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-[var(--ink)] border-b border-[var(--rule)]">
            <div className="flex-1 font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)]">session</div>
            <div className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)] w-16 text-right">cpm</div>
            <div className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)] w-14 text-right">acc</div>
            <div className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)] w-14 text-right">time</div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center font-[var(--font-mono)] text-sm text-[var(--fg-4)]">
              loading...
            </div>
          ) : !sessions?.length ? (
            <div className="py-16 text-center">
              <p className="font-[var(--font-mono)] text-sm text-[var(--fg-4)] mb-4">아직 연습 기록이 없어요</p>
              <Link
                href="/setup"
                className="px-4 py-2 bg-[var(--accent)] text-[var(--ink)] rounded-lg font-medium text-sm"
              >
                연습 시작하기
              </Link>
            </div>
          ) : (
            sessions.map((session, i) => (
              <div
                key={session.id}
                className={`flex items-center gap-4 px-5 py-3 border-b border-[var(--rule)] last:border-0 ${
                  i === 0 ? 'bg-[var(--accent)]/5' : 'hover:bg-[var(--ink)]/40'
                } transition-colors`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-[var(--font-mono)] text-xs text-[var(--fg-2)] truncate">
                    {i === 0 && <span className="text-[var(--accent)] mr-1.5">›</span>}
                    session_{session.id.slice(0, 8)}
                  </div>
                  <div className="font-[var(--font-mono)] text-[10px] text-[var(--fg-5)] mt-0.5">
                    {formatDate(session.played_at)}
                  </div>
                </div>
                <div className="font-[var(--font-mono)] font-semibold text-sm text-[var(--fg-1)] w-16 text-right">
                  {session.cpm}
                </div>
                <div className={`font-[var(--font-mono)] text-sm w-14 text-right ${
                  session.accuracy >= 0.97 ? 'text-[var(--good)]' :
                  session.accuracy >= 0.90 ? 'text-[var(--warn)]' :
                  'text-[var(--bad)]'
                }`}>
                  {Math.round(session.accuracy * 100)}%
                </div>
                <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] w-14 text-right">
                  {formatDuration(session.duration_sec)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
