'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/common/Header'

const STORAGE_KEY = 'codebeat_lesson_progress'

const LESSONS = [
  { id: 1, title: '홈포지션', desc: '손가락 기본 위치 (asdf / jkl;)' },
  { id: 2, title: '알파벳 상단 행', desc: 'qwerty / uiop' },
  { id: 3, title: '알파벳 하단 행', desc: 'zxcv / bnm' },
  { id: 4, title: '숫자 행', desc: '1~0 + 백틱' },
  { id: 5, title: '특수문자 기초', desc: '!, @, #, $, %, ^, &, *' },
  { id: 6, title: '코딩 특수문자', desc: '{}, [], (), ;, :, \', "' },
  { id: 7, title: 'Python 패턴', desc: ':, _, #, 들여쓰기' },
  { id: 8, title: 'JavaScript 패턴', desc: '=>, {}, ;, const, let' },
  { id: 9, title: 'Java 패턴', desc: '{}, ;, 대소문자 혼합' },
  { id: 10, title: 'C 패턴', desc: '*, ->, #include, ;' },
  { id: 11, title: 'SQL 패턴', desc: 'SELECT, WHERE, _, 대문자 키워드' },
]

type Progress = Record<string, { passed: boolean; accuracy: number }>

export default function LessonPage() {
  const [progress, setProgress] = useState<Progress>({})

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
      setProgress(saved)
    } catch {
      setProgress({})
    }
  }, [])

  const passedCount = LESSONS.filter(l => progress[String(l.id)]?.passed).length

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--fg-1)] font-[var(--font-sans)]">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] mb-2">
            <span className="text-[var(--syn-com)]">//</span> lessons
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-light text-[var(--fg-1)] tracking-tight">
                키보드 <span className="text-[var(--accent)]">레슨</span>
              </h1>
              <p className="text-sm text-[var(--fg-3)] mt-1.5 font-[var(--font-mono)]">
                추천 순서가 있지만 자유롭게 선택 가능합니다
              </p>
            </div>
            {/* 진행률 */}
            <div className="text-right">
              <div className="font-[var(--font-mono)] text-2xl font-semibold text-[var(--fg-1)]">
                {passedCount}
                <span className="text-sm text-[var(--fg-4)] font-normal"> / {LESSONS.length}</span>
              </div>
              <div className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--fg-4)]">
                completed
              </div>
            </div>
          </div>

          {/* 진행 바 */}
          <div className="mt-4 h-1 bg-[var(--rule)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
              style={{ width: `${(passedCount / LESSONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 레슨 목록 */}
        <div className="space-y-2">
          {LESSONS.map((lesson) => {
            const p = progress[String(lesson.id)]
            const passed = p?.passed ?? false
            const tried = !!p

            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`} className="block group">
                <div className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
                  passed
                    ? 'border-[var(--good)]/30 bg-[var(--good)]/5 hover:bg-[var(--good)]/10'
                    : 'border-[var(--rule)] bg-[var(--paper-2)] hover:border-[var(--accent)]/30'
                }`}>
                  {/* 번호 / 완료 아이콘 */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-[var(--font-mono)] font-bold text-sm flex-shrink-0 ${
                    passed
                      ? 'bg-[var(--good)] text-[var(--ink)]'
                      : tried
                      ? 'bg-[var(--warn)]/20 text-[var(--warn)] border border-[var(--warn)]/30'
                      : 'bg-[var(--paper-3)] text-[var(--fg-3)]'
                  }`}>
                    {passed ? '✓' : lesson.id}
                  </div>

                  {/* 제목 + 설명 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[var(--fg-1)]">{lesson.title}</span>
                      {passed && p?.accuracy && (
                        <span className="font-[var(--font-mono)] text-[10px] text-[var(--good)] opacity-70">
                          {p.accuracy}%
                        </span>
                      )}
                    </div>
                    <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] mt-0.5">
                      {lesson.desc}
                    </div>
                  </div>

                  {/* 화살표 */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    passed ? 'bg-[var(--good)]/20' : 'bg-[var(--accent)]/10'
                  }`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      className={passed ? 'text-[var(--good)]' : 'text-[var(--accent)]'}>
                      <path d="M4.5 2.5l3 3.5-3 3.5" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 font-[var(--font-mono)] text-xs text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 2.5l-3 3.5 3 3.5" />
            </svg>
            코딩 타자 연습으로
          </Link>
        </div>
      </div>
    </div>
  )
}
