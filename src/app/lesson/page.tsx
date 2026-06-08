'use client'

import Link from 'next/link'
import Header from '@/components/common/Header'

const lessons = [
  { id: 1, title: '홈포지션', desc: '손가락 기본 위치 (asdf / jkl;)', completed: false },
  { id: 2, title: '알파벳 상단 행', desc: 'qwerty / uiop', completed: false },
  { id: 3, title: '알파벳 하단 행', desc: 'zxcv / bnm', completed: false },
  { id: 4, title: '숫자 행', desc: '1~0 + 백틱', completed: false },
  { id: 5, title: '특수문자 기초', desc: '!, @, #, $, %, ^, &, *', completed: false },
  { id: 6, title: '코딩 특수문자', desc: '{}, [], (), ;, :, \', "', completed: false },
  { id: 7, title: 'Python 패턴', desc: ':, _, #, 들여쓰기', completed: false },
  { id: 8, title: 'JavaScript 패턴', desc: '=>, {}, ;, const, let', completed: false },
  { id: 9, title: 'Java 패턴', desc: '{}, ;, 대소문자 혼합', completed: false },
  { id: 10, title: 'C 패턴', desc: '*, ->, #include, ;', completed: false },
  { id: 11, title: 'SQL 패턴', desc: 'SELECT, WHERE, _, 대문자 키워드', completed: false },
]

export default function LessonPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)', color: 'var(--fg-1)' }}>
      <Header />
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">키보드 레슨</h1>
          <p className="text-lg" style={{ color: 'var(--fg-2)' }}>
            단계별로 타자 기초를 익혀보세요. 추천 순서가 있지만 자유롭게 선택 가능합니다.
          </p>
        </div>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className="block group"
            >
              <div
                className="p-6 rounded-lg border transition-all duration-200 group-hover:border-opacity-60"
                style={{
                  background: 'var(--paper)',
                  borderColor: 'var(--rule)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{
                        background: lesson.completed ? 'var(--good)' : 'var(--paper-2)',
                        color: lesson.completed ? 'var(--ink)' : 'var(--fg-3)'
                      }}
                    >
                      {lesson.id}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{lesson.title}</h3>
                      <p style={{ color: 'var(--fg-3)' }}>{lesson.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {lesson.completed && (
                      <div
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background: 'var(--good)',
                          color: 'var(--ink)'
                        }}
                      >
                        완료
                      </div>
                    )}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:translate-x-1"
                      style={{ background: 'var(--accent)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 hover:border-opacity-60"
            style={{
              background: 'var(--paper-2)',
              borderColor: 'var(--rule)',
              color: 'var(--fg-2)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}