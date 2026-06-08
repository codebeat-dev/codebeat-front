'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardTopStripe, CardCheckbox, Badge, PlayIcon } from '@/components/common'
import { Gutter, Statusbar } from '@/components/editor'
import { cn } from '@/lib/design-utils'
import type { Language, Difficulty } from '@/types/practice'
import Header from '@/components/common/Header'
import { usePracticeStore } from '@/store/practiceStore'

const LANGUAGES: Language[] = [
  { id: 'python', ext: 'py', name: 'Python', sub: 'pythonic', hint: '들여쓰기 · 콜론' },
  { id: 'js', ext: 'js', name: 'JavaScript', sub: 'es2022', hint: '세미콜론 · 중괄호' },
  { id: 'java', ext: 'java', name: 'Java', sub: 'jdk 21', hint: '타입 · class' },
  { id: 'c', ext: 'c', name: 'C', sub: 'c11', hint: '포인터 · 헤더' },
  { id: 'sql', ext: 'sql', name: 'SQL', sub: 'ansi', hint: '대문자 키워드' },
]

const DIFFICULTIES: Difficulty[] = [
  {
    id: 'beginner', name: '입문', en: 'beginner',
    desc: 'print, 변수, 기본 연산',
    target: '80–150 CPM', level: 1, minutes: 2,
  },
  {
    id: 'easy', name: '초급', en: 'easy',
    desc: '조건문, 반복문, 함수 호출',
    target: '150–250 CPM', level: 2, minutes: 3,
  },
  {
    id: 'mid', name: '중급', en: 'intermediate',
    desc: '함수 정의, 클래스, 자료구조',
    target: '250+ CPM', level: 3, minutes: 5,
  },
]

type LangCardProps = {
  lang: Language
  selected: boolean
  onSelect: (id: string) => void
}

const LangCard = ({ lang, selected, onSelect }: LangCardProps) => (
  <Card variant="language" selected={selected} onSelect={() => onSelect(lang.id)}>
    <CardTopStripe visible={selected} />
    <CardCheckbox checked={selected} />

    <div className="font-mono font-semibold text-xl flex items-baseline gap-0">
      <span className="text-[var(--fg-4)]">.</span>
      <span className={selected ? 'text-[var(--accent-2)]' : 'text-[var(--fg-1)]'}>
        {lang.ext}
      </span>
    </div>

    <div>
      <div className="font-medium text-sm text-[var(--fg-1)]">{lang.name}</div>
      <div className={cn(
        'font-mono text-xs tracking-wide',
        selected ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'
      )}>
        {lang.hint}
      </div>
    </div>
  </Card>
)

type DiffCardProps = {
  diff: Difficulty
  selected: boolean
  onSelect: (id: string) => void
}

const DiffCard = ({ diff, selected, onSelect }: DiffCardProps) => (
  <Card variant="difficulty" selected={selected} onSelect={() => onSelect(diff.id)}>
    <div className="flex items-center gap-2">
      <span className="font-semibold text-sm">{diff.name}</span>
      <span className={cn(
        'font-mono text-xs lowercase tracking-wide',
        selected ? 'text-[var(--accent-2)]' : 'text-[var(--fg-4)]'
      )}>
        / {diff.en}
      </span>
    </div>

    <div className="font-mono text-xs text-[var(--fg-3)] leading-relaxed">{diff.desc}</div>

    <div className="flex gap-1 mt-1">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={cn(
            'w-4 h-1 rounded-sm',
            selected && i <= diff.level ? 'bg-[var(--accent)]' : 'bg-[var(--rule-2)]'
          )}
        />
      ))}
    </div>
  </Card>
)

export default function Home() {
  const [langId, setLangId] = useState('python')
  const [diffId, setDiffId] = useState('beginner')
  const [started, setStarted] = useState(false)
  const router = useRouter()
  const { setLanguage, setDifficulty } = usePracticeStore()

  const lang = LANGUAGES.find(l => l.id === langId) || null
  const diff = DIFFICULTIES.find(d => d.id === diffId) || null
  const ready = !!lang && !!diff

  // Enter to start, 1-5 for language selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && ready && !started) {
        setStarted(true)
        setLanguage(langId)
        setDifficulty(diffId)
        setTimeout(() => {
          setStarted(false)
          router.push('/practice')
        }, 1800)
      }
      // number 1-5 -> language
      if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key, 10) - 1
        if (LANGUAGES[idx]) setLangId(LANGUAGES[idx].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready, started])

  return (
    <div className="h-screen grid grid-rows-[56px_1fr_24px] bg-[var(--paper)] text-[var(--fg-1)] font-[var(--font-sans)] overflow-hidden">
      <Header />

      <div className="grid grid-cols-[56px_1fr] overflow-hidden relative max-md:grid-cols-[32px_1fr]">
        <Gutter rows={48} focusLine={ready ? 32 : null} />

        <div className="overflow-y-auto relative z-10">
          <div className="max-w-[760px] mx-auto py-10 px-8 relative">
            {/* Wordmark */}
            <h1 className="font-[var(--font-mono)] font-bold text-[38px] leading-none tracking-tight text-[var(--fg-1)] flex items-baseline gap-0 mb-3 max-md:text-[36px]">
              <span>CodeBeat</span>
              <span className="text-[var(--accent)]">_</span>
              <span className="inline-block w-[0.55ch] h-[0.9em] bg-[var(--accent)] ml-0.5 translate-y-[0.08em] animate-pulse" />
            </h1>

            <p className="font-[var(--font-mono)] text-sm text-[var(--fg-3)] mb-5">
              <span className="text-[var(--accent)]">&gt;</span> 코드를 치며 문법의 리듬을 익혀보세요.
            </p>

            {/* Meta row */}
            <div className="flex gap-5 flex-wrap font-[var(--font-mono)] text-xs text-[var(--fg-4)] border-t border-b border-[var(--rule)] py-2 mb-7">
              <span><b className="text-[var(--fg-2)] font-medium">5</b> languages</span>
              <span><b className="text-[var(--fg-2)] font-medium">3</b> levels</span>
              <span>powered by <b className="text-[var(--fg-2)] font-medium">Claude</b></span>
              <span className="ml-auto">session #<b className="text-[var(--fg-2)] font-medium">2,847</b></span>
            </div>

            {/* Language Selection */}
            <section className="mb-7">
              <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] mb-3 flex items-center gap-2">
                <span className="text-[var(--syn-com)]">{'//'}</span>
                <Badge variant="step">01</Badge>
                <span>select language</span>
                <span className="ml-auto text-xs flex gap-1">
                  press <Badge variant="code">1</Badge>–<Badge variant="code">5</Badge>
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2.5 max-md:grid-cols-2 max-md:[&>:nth-child(5)]:col-span-2">
                {LANGUAGES.map(l => (
                  <LangCard
                    key={l.id}
                    lang={l}
                    selected={langId === l.id}
                    onSelect={setLangId}
                  />
                ))}
              </div>
            </section>

            {/* Difficulty Selection */}
            <section className="mb-7">
              <div className="font-[var(--font-mono)] text-xs text-[var(--fg-4)] mb-3 flex items-center gap-2">
                <span className="text-[var(--syn-com)]">{'//'}</span>
                <Badge variant="step">02</Badge>
                <span>select difficulty</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-1">
                {DIFFICULTIES.map(d => (
                  <DiffCard
                    key={d.id}
                    diff={d}
                    selected={diffId === d.id}
                    onSelect={setDiffId}
                  />
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                disabled={!ready || started}
                icon={<PlayIcon />}
                keyboard={ready && !started ? "⏎ enter" : undefined}
                onClick={() => {
                  setStarted(true)
                  setLanguage(langId)
                  setDifficulty(diffId)
                  setTimeout(() => {
                    setStarted(false)
                    router.push('/practice')
                  }, 1800)
                }}
                className="flex-1"
              >
                {started ? 'generating example...' : 'start practice'}
              </Button>

              <Button variant="secondary" icon={<span>?</span>}>
                how it works
              </Button>
            </div>

            {/* Footer note */}
            <div className="mt-5 pt-3 border-t border-[var(--rule)] font-[var(--font-mono)] text-xs text-[var(--fg-4)] flex gap-4 flex-wrap">
              <span>&gt; 자동완성·붙여넣기 비활성화</span>
              <span>&gt; 오타는 백스페이스로만 수정</span>
              <span>&gt; CPM · 정확도 실시간 측정</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statusbar */}
      <Statusbar lang={lang} diff={diff} ready={ready} />
    </div>
  )
}
