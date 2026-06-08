'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from '@/components/common/Header'
import { getRanking } from '@/lib/api/ranking'
import { useRankingSocket } from '@/hooks/useRankingSocket'
import { useAuthStore } from '@/store/authStore'
import type { RankingEntry } from '@/lib/api/ranking'

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C', 'SQL']

const medalColor = (rank: number) => {
  if (rank === 1) return 'text-[#FFD700]'
  if (rank === 2) return 'text-[#C0C0C0]'
  if (rank === 3) return 'text-[#CD7F32]'
  return 'text-[var(--fg-4)]'
}

type RankRowProps = {
  entry: RankingEntry
  isMe: boolean
}

const RankRow = ({ entry, isMe }: RankRowProps) => (
  <div className={`flex items-center gap-4 px-5 py-3.5 border-b border-[var(--rule)] transition-colors ${
    isMe ? 'bg-[var(--accent)]/5 border-l-2 border-l-[var(--accent)]' : 'hover:bg-[var(--paper-2)]'
  }`}>
    {/* 순위 */}
    <div className={`font-[var(--font-mono)] font-bold text-lg w-8 text-center ${medalColor(entry.rank)}`}>
      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
    </div>

    {/* 유저명 */}
    <div className="flex-1 min-w-0">
      <span className={`font-medium text-sm truncate ${isMe ? 'text-[var(--accent)]' : 'text-[var(--fg-1)]'}`}>
        {entry.username}
        {isMe && <span className="ml-2 text-[10px] font-[var(--font-mono)] text-[var(--accent)] opacity-70">you</span>}
      </span>
    </div>

    {/* CPM */}
    <div className="text-right">
      <div className="font-[var(--font-mono)] font-semibold text-lg text-[var(--fg-1)]">{entry.best_cpm}</div>
      <div className="font-[var(--font-mono)] text-[10px] text-[var(--fg-4)] tracking-wider uppercase">cpm</div>
    </div>

    {/* 정확도 */}
    <div className="text-right w-16">
      <div className={`font-[var(--font-mono)] font-semibold text-sm ${
        entry.best_accuracy >= 0.97 ? 'text-[var(--good)]' :
        entry.best_accuracy >= 0.90 ? 'text-[var(--warn)]' :
        'text-[var(--bad)]'
      }`}>
        {Math.round(entry.best_accuracy * 100)}%
      </div>
      <div className="font-[var(--font-mono)] text-[10px] text-[var(--fg-4)] tracking-wider uppercase">acc</div>
    </div>
  </div>
)

export default function RankingPage() {
  const [selectedLang, setSelectedLang] = useState('Python')
  const user = useAuthStore((s) => s.user)

  // REST API — 초기 데이터
  const { data: restData, isLoading } = useQuery({
    queryKey: ['ranking', selectedLang],
    queryFn: () => getRanking(selectedLang),
  })

  // WebSocket — 실시간 업데이트
  const wsData = useRankingSocket(selectedLang)

  // WebSocket 데이터 우선, 없으면 REST 데이터
  const rankingData = wsData ?? restData

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--fg-1)] font-[var(--font-sans)]">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] mb-2">
            <span className="text-[var(--syn-com)]">//</span> ranking
          </div>
          <h1 className="text-3xl font-light text-[var(--fg-1)] tracking-tight">
            언어별 <span className="text-[var(--accent)]">랭킹</span>
          </h1>
          <p className="text-sm text-[var(--fg-3)] mt-1.5 font-[var(--font-mono)]">
            최고 CPM 기준 · 실시간 업데이트
          </p>
        </div>

        {/* 언어 탭 */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3.5 py-1.5 rounded-lg font-[var(--font-mono)] text-xs font-medium transition-colors ${
                selectedLang === lang
                  ? 'bg-[var(--accent)] text-[var(--ink)]'
                  : 'bg-[var(--paper-2)] text-[var(--fg-3)] border border-[var(--rule)] hover:border-[var(--accent)]/40'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* 랭킹 테이블 */}
        <div className="border border-[var(--rule)] rounded-xl overflow-hidden bg-[var(--paper-2)]">
          {/* 컬럼 헤더 */}
          <div className="flex items-center gap-4 px-5 py-2.5 bg-[var(--ink)] border-b border-[var(--rule)]">
            <div className="w-8 font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)]">#</div>
            <div className="flex-1 font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)]">user</div>
            <div className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)]">cpm</div>
            <div className="w-16 text-right font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)]">acc</div>
          </div>

          {isLoading && !rankingData ? (
            <div className="py-16 text-center font-[var(--font-mono)] text-sm text-[var(--fg-4)]">
              loading...
            </div>
          ) : rankingData?.rankings.length === 0 ? (
            <div className="py-16 text-center font-[var(--font-mono)] text-sm text-[var(--fg-4)]">
              아직 기록이 없습니다
            </div>
          ) : (
            rankingData?.rankings.map(entry => (
              <RankRow
                key={entry.user_id}
                entry={entry}
                isMe={!!user && entry.user_id === user.id}
              />
            ))
          )}
        </div>

        {/* 내 순위 */}
        {rankingData?.my_rank && (
          <div className="mt-4 px-5 py-3 border border-[var(--accent)]/20 bg-[var(--accent)]/5 rounded-xl font-[var(--font-mono)] text-sm text-[var(--fg-2)] flex items-center gap-2">
            <span className="text-[var(--accent)]">›</span>
            내 순위:
            <span className="text-[var(--accent)] font-semibold">{rankingData.my_rank}위</span>
          </div>
        )}

        {/* WebSocket 연결 상태 */}
        <div className="mt-4 flex items-center gap-1.5 font-[var(--font-mono)] text-[10px] text-[var(--fg-5)]">
          <span className={`w-1.5 h-1.5 rounded-full ${wsData ? 'bg-[var(--good)] animate-pulse' : 'bg-[var(--fg-5)]'}`} />
          {wsData ? '실시간 연결됨' : '연결 대기 중'}
        </div>
      </div>
    </div>
  )
}
