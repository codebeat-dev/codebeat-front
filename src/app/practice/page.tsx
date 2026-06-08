'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { tokenize, flatten, groupLines } from '@/lib/tokenizer'
import { useAdvancedTyping } from '@/hooks/useAdvancedTyping'

const LANGS = [
  { id: 'python', ext: 'py' },
  { id: 'js', ext: 'js' },
  { id: 'java', ext: 'java' },
  { id: 'c', ext: 'c' },
  { id: 'sql', ext: 'sql' },
] as const

const DIFFS = [
  { id: 'beginner', label: 'beginner' },
  { id: 'easy', label: 'easy' },
  { id: 'mid', label: 'intermediate' },
] as const

type LangId = (typeof LANGS)[number]['id']
type DiffId = (typeof DIFFS)[number]['id']

const SAMPLES: Record<`${LangId}_${DiffId}`, string[]> = {
  python_beginner: [
`# 인사하기
name = "Codey"
print("hello, " + name)
print("welcome to codebeat")
`,
`# 합계 구하기
a = 12
b = 30
total = a + b
print("sum =", total)
`,
  ],
  python_easy: [
`# 짝수만 출력
numbers = [1, 2, 3, 4, 5, 6]
for n in numbers:
    if n % 2 == 0:
        print(n, "is even")
`,
`# 제곱 리스트
def square(n):
    return n * n

for i in range(1, 6):
    print(i, square(i))
`,
  ],
  python_mid: [
`# 단어 빈도 세기
def count_words(text):
    counts = {}
    for word in text.split():
        counts[word] = counts.get(word, 0) + 1
    return counts

result = count_words("a b a c b a")
print(sorted(result.items()))
`,
  ],
  js_beginner: [
`// 인사하기
const name = "Codey";
console.log("hello, " + name);
console.log("welcome!");
`,
`// 합계
let a = 12;
let b = 30;
console.log("sum =", a + b);
`,
  ],
  js_easy: [
`// 짝수만 거르기
const nums = [1, 2, 3, 4, 5, 6];
const even = nums.filter((n) => n % 2 === 0);
console.log(even);
`,
`// 제곱 매핑
const range = [1, 2, 3, 4, 5];
const squares = range.map((n) => n * n);
console.log(squares);
`,
  ],
  js_mid: [
`// 디바운스 유틸
const debounce = (fn, wait) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};
`,
  ],
  java_beginner: [
`// 인사하기
public class Main {
    public static void main(String[] args) {
        System.out.println("hello, world");
    }
}
`,
  ],
  java_easy: [
`// 1부터 5까지 합
public class Sum {
    public static void main(String[] args) {
        int total = 0;
        for (int i = 1; i <= 5; i++) {
            total += i;
        }
        System.out.println(total);
    }
}
`,
  ],
  java_mid: [
`// 간단한 카운터 클래스
public class Counter {
    private int count = 0;

    public void increment() {
        count++;
    }

    public int get() {
        return count;
    }
}
`,
  ],
  c_beginner: [
`// 인사하기
#include <stdio.h>

int main(void) {
    printf("hello, world\\n");
    return 0;
}
`,
  ],
  c_easy: [
`// 1부터 5까지 합
#include <stdio.h>

int main(void) {
    int total = 0;
    for (int i = 1; i <= 5; i++) {
        total += i;
    }
    printf("%d\\n", total);
    return 0;
}
`,
  ],
  c_mid: [
`// 포인터로 값 교환
#include <stdio.h>

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 1, y = 2;
    swap(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}
`,
  ],
  sql_beginner: [
`-- 모든 사용자 조회
SELECT id, name
FROM users
WHERE active = 1;
`,
  ],
  sql_easy: [
`-- 최근 주문 정렬
SELECT name, amount
FROM orders
WHERE amount > 100
ORDER BY amount DESC;
`,
  ],
  sql_mid: [
`-- 상위 고객 집계
SELECT name, SUM(amount) AS total
FROM orders
GROUP BY name
HAVING total > 1000
ORDER BY total DESC
LIMIT 10;
`,
  ],
}

const isLangId = (value: string | null): value is LangId =>
  LANGS.some(lang => lang.id === value)

const isDiffId = (value: string | null): value is DiffId =>
  DIFFS.some(diff => diff.id === value)

const getSamples = (langId: LangId, diffId: DiffId) =>
  SAMPLES[`${langId}_${diffId}`] || SAMPLES[`${langId}_beginner`] || SAMPLES.python_beginner

const getInitialLang = (value: string | null): LangId => isLangId(value) ? value : 'python'
const getInitialDiff = (value: string | null): DiffId => isDiffId(value) ? value : 'beginner'

const formatTime = (ms: number): string => {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const PracticeContent = () => {
  const searchParams = useSearchParams()
  const [langId, setLangId] = useState<LangId>(() => getInitialLang(searchParams.get('lang')))
  const [diffId, setDiffId] = useState<DiffId>(() => getInitialDiff(searchParams.get('diff')))
  const [sampleIdx, setSampleIdx] = useState(0)
  const [typingActive, setTypingActive] = useState(false)
  const typingTimer = useRef<NodeJS.Timeout | null>(null)

  const pool = useMemo(() => getSamples(langId, diffId), [langId, diffId])
  const code = pool[sampleIdx % pool.length]
  const chars = useMemo(() => flatten(tokenize(code, langId)), [code, langId])
  const lines = useMemo(() => groupLines(chars), [chars])

  const {
    history,
    startTime,
    endTime,
    paused,
    errors,
    totalKeys,
    cpm,
    accuracy,
    elapsedMs,
    handleKeyPress,
    reset,
    togglePause,
    getCharState,
    setNow,
  } = useAdvancedTyping(chars, lines, true)

  const phase = endTime ? 'done' : startTime ? 'typing' : 'idle'
  const lang = LANGS.find(item => item.id === langId) ?? LANGS[0]
  const diff = DIFFS.find(item => item.id === diffId) ?? DIFFS[0]
  const wpm = Math.round(cpm / 5)
  const timeStr = formatTime(elapsedMs)
  const accClass = accuracy >= 97 ? '' : accuracy >= 90 ? 'warn' : 'bad'

  const flashTyping = useCallback(() => {
    setTypingActive(true)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setTypingActive(false), 650)
  }, [])

  const resetPractice = useCallback(() => {
    reset()
    setTypingActive(false)
  }, [reset])

  const nextExample = useCallback(() => {
    setSampleIdx(index => (index + 1) % Math.max(1, pool.length))
    reset()
    setTypingActive(false)
  }, [pool.length, reset])

  const pickLang = (id: LangId) => {
    if (id === langId) return
    setLangId(id)
    setSampleIdx(0)
    resetPractice()
  }

  const pickDiff = (id: DiffId) => {
    if (id === diffId) return
    setDiffId(id)
    setSampleIdx(0)
    resetPractice()
  }

  useEffect(() => {
    if (!startTime || endTime || paused) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [startTime, endTime, paused, setNow])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (endTime) {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault()
          resetPractice()
        } else if (e.key === 'Tab') {
          e.preventDefault()
          nextExample()
        }
        return
      }

      if (e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault()
        resetPractice()
        return
      }

      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault()
        togglePause()
        return
      }

      if (paused) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        handleKeyPress('Backspace')
        flashTyping()
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyPress('\n')
        flashTyping()
        return
      }

      if (e.key.length === 1) {
        if (e.isComposing || e.keyCode === 229) return
        const koreanJamo = /[ㄱ-ㅎㅏ-ㅣ]/
        if (koreanJamo.test(e.key)) return
        e.preventDefault()
        handleKeyPress(e.key)
        flashTyping()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [endTime, paused, handleKeyPress, resetPractice, nextExample, togglePause, flashTyping])

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current)
    }
  }, [])

  return (
    <div className="cb-stage" data-phase={phase}>
      <Link href="/" className="cb-brand" aria-label="CodeBeat home">
        codebeat<span className="cb-brand-accent">_</span><span className="cb-brand-caret" aria-hidden="true" />
      </Link>

      {phase === 'typing' && (
        <div className="cb-live">
          <div className="cb-live-pair"><span className="cb-live-value">{cpm}</span><span className="cb-live-key">cpm</span></div>
          <div className="cb-live-pair"><span className={`cb-live-value ${accClass}`}>{accuracy}%</span><span className="cb-live-key">acc</span></div>
          <div className="cb-live-pair"><span className="cb-live-value">{timeStr}</span><span className="cb-live-key">time</span></div>
        </div>
      )}

      <main className="cb-center">
        <div className="cb-config" aria-label="practice settings">
          <div className="cb-config-group">
            {LANGS.map(item => (
              <button key={item.id} type="button" className={`cb-option ${item.id === langId ? 'active' : ''}`} onClick={() => pickLang(item.id)}>
                <span>.</span>{item.ext}
              </button>
            ))}
          </div>
          <div className="cb-config-sep" />
          <div className="cb-config-group">
            {DIFFS.map(item => (
              <button key={item.id} type="button" className={`cb-option ${item.id === diffId ? 'active' : ''}`} onClick={() => pickDiff(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <section className="cb-typing" data-typing={typingActive ? '1' : '0'} aria-label="typing practice">
          <div className="cb-code">
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} className="cb-line-row">
                {line.map(char => {
                  const charState = getCharState(char.idx)
                  const h = history[char.idx]
                  const isNewline = char.ch === '\n'
                  const isSpace = char.ch === ' '
                  const display = isNewline ? '' : h && !h.ok && isSpace ? '·' : char.ch
                  return (
                    <span
                      key={char.idx}
                      className={`cb-char tok-${char.type} ${charState === 'cursor' ? 'cursor' : charState} ${isSpace ? 'is-space' : ''}`}
                    >
                      {display}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </section>

        <div className="cb-hints">
          {phase === 'idle' ? (
            <div className="cb-hint-item start"><span className="cb-dot" /><span>아무 키나 눌러 시작</span></div>
          ) : (
            <>
              <div className="cb-hint-item"><kbd>tab</kbd><span>다시 시작</span></div>
              <div className="cb-hint-item"><kbd>ctrl</kbd><kbd>space</kbd><span>일시정지</span></div>
            </>
          )}
        </div>
      </main>

      {paused && (
        <div className="cb-paused">
          <span>paused — <kbd>ctrl</kbd> <kbd>space</kbd> 로 재개</span>
        </div>
      )}

      {phase === 'done' && (
        <div className="cb-results">
          <div className="cb-results-head"><span>{'>'}_</span> practice complete</div>
          <div className="cb-results-grid">
            <div className="cb-result-big"><div className="cb-result-value">{cpm}</div><div className="cb-result-label">CPM</div></div>
            <div className="cb-result-big sub"><div className={`cb-result-value ${accClass}`}>{accuracy}%</div><div className="cb-result-label">accuracy</div></div>
            <div className="cb-result-big sub"><div className="cb-result-value">{timeStr}</div><div className="cb-result-label">time</div></div>
          </div>
          <div className="cb-results-meta">
            <span><b>{wpm}</b> wpm</span>
            <span><b>{errors}</b> errors</span>
            <span><b>{totalKeys}</b> keys</span>
            <span><b>.{lang.ext}</b></span>
            <span><b>{diff.label}</b></span>
          </div>
          <div className="cb-result-actions">
            <button type="button" className="cb-result-button primary" onClick={resetPractice}>다시 <kbd>enter</kbd></button>
            <button type="button" className="cb-result-button" onClick={nextExample}>다음 예제 <kbd>tab</kbd></button>
          </div>
        </div>
      )}

      <style jsx global>{`
        :root {
          --ink: #11141B;
          --paper: #11141B;
          --paper-2: #161A22;
          --paper-3: #1B202A;
          --rule: rgba(255,255,255,0.06);
          --rule-2: rgba(255,255,255,0.10);
          --fg-1: #E6E7E2;
          --fg-2: #9298A6;
          --fg-3: #6A7080;
          --fg-4: #474C59;
          --fg-5: #2B303B;
          --accent: var(--primary-600);
          --accent-2: var(--primary-400);
          --accent-wash: rgba(83,74,183,0.14);
          --accent-ink: #0E140C;
          --good: var(--brand-accent-400);
          --warn: var(--semantic-warning-400);
          --bad: var(--semantic-error-400);
          --bad-wash: rgba(226,75,74,0.18);
          --syn-key: var(--primary-400);
          --syn-str: var(--brand-accent-400);
          --syn-fn: var(--brand-accent-200);
          --syn-com: #586273;
          --syn-num: var(--semantic-warning-400);
          --syn-type: var(--primary-200);
          --syn-op: #7D8A9D;
          --syn-punct: #9298A6;
        }

        body { overflow: hidden; }

        .cb-stage {
          min-height: 100vh;
          background: var(--ink);
          color: var(--fg-1);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .cb-brand {
          position: fixed;
          top: 22px;
          left: 26px;
          z-index: 5;
          display: flex;
          align-items: baseline;
          gap: 0;
          color: var(--fg-2);
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0;
          text-decoration: none;
          user-select: none;
        }

        .cb-brand-accent { color: var(--accent); }
        .cb-brand-caret {
          display: inline-block;
          width: 0.5ch;
          height: 1.05em;
          margin-left: 1px;
          background: var(--accent);
          transform: translateY(0.12em);
          animation: cb-blink 1.1s steps(1) infinite;
        }

        @keyframes cb-blink { 50% { opacity: 0; } }

        .cb-live {
          position: fixed;
          top: 22px;
          right: 26px;
          z-index: 5;
          display: flex;
          align-items: baseline;
          gap: 18px;
          color: var(--fg-3);
          font-family: var(--font-mono);
          font-size: 13px;
          user-select: none;
        }

        .cb-live-pair { display: flex; align-items: baseline; gap: 6px; }
        .cb-live-value {
          min-width: 2ch;
          color: var(--accent);
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          text-align: right;
        }
        .cb-live-value.warn { color: var(--warn); }
        .cb-live-value.bad { color: var(--bad); }
        .cb-live-key { color: var(--fg-5); font-size: 11px; letter-spacing: 0.04em; }

        .cb-center {
          flex: 1;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 80px 40px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .cb-config {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          padding: 9px 16px;
          border: 1px solid var(--rule);
          border-radius: 10px;
          background: var(--paper-2);
          font-family: var(--font-mono);
          font-size: 13.5px;
          transition: opacity .35s ease;
        }
        .cb-stage[data-phase="typing"] .cb-config { opacity: 0.22; }
        .cb-stage[data-phase="typing"] .cb-config:hover { opacity: 1; }
        .cb-config-group { display: flex; align-items: center; gap: 13px; }
        .cb-config-sep { width: 1px; height: 15px; background: var(--rule); }

        .cb-option {
          appearance: none;
          border: 0;
          background: none;
          color: var(--fg-3);
          cursor: pointer;
          font: inherit;
          letter-spacing: 0.01em;
          padding: 2px 0;
          transition: color .12s ease;
        }
        .cb-option:hover { color: var(--fg-2); }
        .cb-option:focus-visible { outline: none; color: var(--fg-2); }
        .cb-option.active { color: var(--accent); }
        .cb-option span { color: var(--fg-5); }
        .cb-option.active span { color: var(--accent); opacity: .6; }

        .cb-typing { width: 100%; position: relative; }
        .cb-code {
          color: var(--fg-4);
          font-family: var(--font-mono);
          font-size: 24px;
          line-height: 1.85;
          letter-spacing: 0;
          tab-size: 4;
          user-select: none;
        }
        .cb-line-row { min-height: 1.85em; white-space: pre; }
        .cb-char {
          position: relative;
          color: var(--fg-4);
          transition: color .05s linear;
        }
        .cb-char.correct { color: var(--fg-1); }
        .cb-char.incorrect {
          color: var(--bad);
          background: var(--bad-wash);
          border-radius: 2px;
        }
        .cb-char.correct.tok-keyword { color: var(--syn-key); }
        .cb-char.correct.tok-string { color: var(--syn-str); }
        .cb-char.correct.tok-function,
        .cb-char.correct.tok-builtin { color: var(--syn-fn); }
        .cb-char.correct.tok-comment { color: var(--syn-com); }
        .cb-char.correct.tok-number { color: var(--syn-num); }
        .cb-char.correct.tok-operator { color: var(--syn-op); }
        .cb-char.correct.tok-punct { color: var(--syn-punct); }

        .cb-char.cursor::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 0.16em;
          width: 2px;
          height: 1.2em;
          border-radius: 1px;
          background: var(--accent);
          animation: cb-caret 1.05s ease-in-out infinite;
        }
        .cb-typing[data-typing="1"] .cb-char.cursor::before { animation: none; }
        @keyframes cb-caret { 0%,100% { opacity: 1; } 50% { opacity: .15; } }

        .cb-hints {
          min-height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          color: var(--fg-5);
          font-family: var(--font-mono);
          font-size: 12px;
          user-select: none;
        }
        .cb-hint-item { display: flex; align-items: center; gap: 7px; white-space: nowrap; }
        .cb-hint-item.start { color: var(--fg-3); }
        .cb-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: cb-caret 1.4s ease-in-out infinite;
        }
        .cb-stage kbd {
          border: 1px solid var(--fg-5);
          border-radius: 4px;
          background: var(--paper-2);
          color: var(--fg-3);
          font-family: var(--font-mono);
          font-size: 10.5px;
          line-height: 1.4;
          padding: 1.5px 6px;
        }

        .cb-paused {
          position: fixed;
          inset: 0;
          z-index: 18;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(17,20,27,.7);
          backdrop-filter: blur(3px);
          color: var(--fg-2);
          font-family: var(--font-mono);
          font-size: 15px;
        }

        .cb-results {
          position: fixed;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 34px;
          background: rgba(17,20,27,.86);
          backdrop-filter: blur(6px);
          animation: cb-fadein .3s ease;
        }
        @keyframes cb-fadein { from { opacity: 0; } to { opacity: 1; } }
        .cb-results-head {
          color: var(--fg-3);
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: .04em;
        }
        .cb-results-head span { color: var(--accent); }
        .cb-results-grid { display: flex; align-items: flex-end; gap: 0; }
        .cb-result-big {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 44px;
          border-right: 1px solid var(--rule);
        }
        .cb-result-big:last-child { border-right: 0; }
        .cb-result-value {
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 76px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0;
          line-height: 1;
        }
        .cb-result-big.sub .cb-result-value { color: var(--fg-1); font-size: 44px; }
        .cb-result-value.warn { color: var(--warn) !important; }
        .cb-result-value.bad { color: var(--bad) !important; }
        .cb-result-label {
          margin-top: 12px;
          color: var(--fg-3);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: .05em;
        }
        .cb-results-meta {
          display: flex;
          gap: 18px;
          color: var(--fg-5);
          font-family: var(--font-mono);
          font-size: 12.5px;
        }
        .cb-results-meta b { color: var(--fg-2); font-weight: 500; }
        .cb-result-actions { display: flex; gap: 12px; }
        .cb-result-button {
          appearance: none;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid var(--rule);
          border-radius: 8px;
          background: var(--paper-2);
          color: var(--fg-2);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 11px 20px;
          transition: all .12s ease;
        }
        .cb-result-button:hover { border-color: var(--fg-5); color: var(--fg-1); }
        .cb-result-button.primary {
          border-color: var(--accent);
          background: var(--accent);
          color: var(--accent-ink);
          font-weight: 600;
        }
        .cb-result-button.primary:hover { border-color: var(--accent-2); background: var(--accent-2); }
        .cb-result-button.primary kbd { border-color: rgba(0,0,0,.25); background: rgba(0,0,0,.12); color: var(--accent-ink); }

        @media (max-width: 720px) {
          .cb-center { padding: 80px 22px 40px; gap: 30px; }
          .cb-code { font-size: 19px; }
          .cb-live { display: none; }
          .cb-results-grid { flex-wrap: wrap; justify-content: center; gap: 18px 0; }
          .cb-result-big { padding: 0 24px; }
          .cb-result-value { font-size: 56px; }
        }
      `}</style>
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--ink)]" />}>
      <PracticeContent />
    </Suspense>
  )
}
