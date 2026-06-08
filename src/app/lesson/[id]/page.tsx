'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/common/Header'

type Lesson = {
  title: string
  description: string
  practiceText: string
  keyHighlight: string[]
}

const lessonData: Record<string, Lesson> = {
  '1': {
    title: '홈포지션',
    description: '손가락의 기본 위치를 익혀보세요. 왼손은 asdf, 오른손은 jkl; 키에 올려놓습니다.',
    practiceText: 'asdf jkl; asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj',
    keyHighlight: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  },
  '2': {
    title: '알파벳 상단 행',
    description: '상단 행 qwerty uiop 키들을 연습해보세요.',
    practiceText: 'qwer tyui op qwer tyui op yuio rewq poiu ytre',
    keyHighlight: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  },
  '3': {
    title: '알파벳 하단 행',
    description: '하단 행 zxcv bnm 키들을 연습해보세요.',
    practiceText: 'zxcv bnm zxcv bnm cvxz mnb vcxz nbm',
    keyHighlight: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  },
  '4': {
    title: '숫자 행',
    description: '숫자 키와 백틱을 연습해보세요.',
    practiceText: '1234567890 `123 456` 7890 1234567890',
    keyHighlight: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '`'],
  },
  '5': {
    title: '특수문자 기초',
    description: '기본적인 특수문자들을 연습해보세요.',
    practiceText: '!@#$%^&* !@# $%^ &*( !@#$ %^&* @#$%',
    keyHighlight: ['!', '@', '#', '$', '%', '^', '&', '*'],
  },
  '6': {
    title: '코딩 특수문자',
    description: '프로그래밍에서 자주 사용하는 특수문자들을 연습해보세요.',
    practiceText: '{}[](); {}[] (); {}[](); :"\'; :{[]}',
    keyHighlight: ['{', '}', '[', ']', '(', ')', ';', ':', "'", '"'],
  },
  '7': {
    title: 'Python 패턴',
    description: 'Python에서 자주 쓰이는 콜론, 언더스코어, 들여쓰기 패턴을 연습해보세요.',
    practiceText: 'def add(a, b): return a + b\nfor i in range(10): print(i)\nif x > 0: x = x - 1',
    keyHighlight: [':', '_', '#', ' '],
  },
  '8': {
    title: 'JavaScript 패턴',
    description: 'JavaScript에서 자주 쓰이는 화살표 함수, 중괄호, 세미콜론을 연습해보세요.',
    practiceText: 'const add = (a, b) => a + b;\nlet name = "codebeat";\nconst fn = () => {};',
    keyHighlight: ['=', '>', '{', '}', ';'],
  },
  '9': {
    title: 'Java 패턴',
    description: 'Java에서 자주 쓰이는 중괄호, 세미콜론, 대소문자 혼합을 연습해보세요.',
    practiceText: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("hello");\n    }\n}',
    keyHighlight: ['{', '}', ';', '(', ')'],
  },
  '10': {
    title: 'C 패턴',
    description: 'C에서 자주 쓰이는 포인터, 화살표 연산자, 헤더 포함 패턴을 연습해보세요.',
    practiceText: '#include <stdio.h>\nint main() {\n    int *p = NULL;\n    printf("hello\\n");\n    return 0;\n}',
    keyHighlight: ['*', '-', '>', '#', ';'],
  },
  '11': {
    title: 'SQL 패턴',
    description: 'SQL에서 자주 쓰이는 대문자 키워드, 언더스코어, WHERE 절을 연습해보세요.',
    practiceText: 'SELECT user_name, email FROM users WHERE age > 20 ORDER BY created_at DESC;',
    keyHighlight: ['_', '>', ';', '*'],
  },
}

const STORAGE_KEY = 'codebeat_lesson_progress'

const getLessonProgress = (): Record<string, { passed: boolean; accuracy: number }> => {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

const saveLessonProgress = (id: string, passed: boolean, accuracy: number) => {
  const prev = getLessonProgress()
  // 이미 통과한 레슨은 낮은 점수로 덮어쓰지 않음
  if (prev[id]?.passed && !passed) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...prev,
    [id]: { passed, accuracy },
  }))
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string
  const lesson = lessonData[lessonId]
  const practiceText = lesson?.practiceText ?? ''

  const [step, setStep] = useState<'explanation' | 'practice' | 'result'>('explanation')
  const [userInput, setUserInput] = useState('')
  const [currentPos, setCurrentPos] = useState(0)
  const [errors, setErrors] = useState(0)
  const [totalInputs, setTotalInputs] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (step !== 'practice' || !practiceText) return

    e.preventDefault()

    if (!startTime) {
      setStartTime(Date.now())
    }

    if (e.key === 'Backspace') {
      if (currentPos > 0) {
        setCurrentPos(prev => prev - 1)
        setUserInput(prev => prev.slice(0, -1))
      }
      return
    }

    // Single characters
    if (e.key.length === 1) {
      // Ignore Korean IME composition keys (ㄱ, ㅏ, etc.)
      if (e.isComposing || e.keyCode === 229) {
        return
      }

      const expectedChar = practiceText[currentPos]
      const isCorrect = e.key === expectedChar

      setUserInput(prev => prev + e.key)
      setTotalInputs(prev => prev + 1)

      if (!isCorrect) {
        setErrors(prev => prev + 1)
      }

      setCurrentPos(prev => prev + 1)

      // 연습 완료 체크
      if (currentPos + 1 >= practiceText.length) {
        const finalAccuracy = totalInputs > 0
          ? Math.round(((totalInputs - errors) / totalInputs) * 100)
          : 100
        const passed = finalAccuracy >= 90
        saveLessonProgress(lessonId, passed, finalAccuracy)
        setEndTime(Date.now())
        setStep('result')
      }
    }
  }, [step, currentPos, practiceText, startTime, totalInputs, errors, lessonId])

  const handleBeforeInput = useCallback((e: InputEvent) => {
    if (step !== 'practice' || !practiceText) return
    if (!e.data || e.inputType !== 'insertText') return

    e.preventDefault()

    if (!startTime) {
      setStartTime(Date.now())
    }

    const expectedChar = practiceText[currentPos]
    const isCorrect = e.data === expectedChar

    setUserInput(prev => prev + e.data)
    setTotalInputs(prev => prev + 1)

    if (!isCorrect) {
      setErrors(prev => prev + 1)
    }

    setCurrentPos(prev => prev + 1)

    // 연습 완료 체크
    if (currentPos + 1 >= practiceText.length) {
      const finalAccuracy = totalInputs > 0
        ? Math.round(((totalInputs - errors) / totalInputs) * 100)
        : 100
      const passed = finalAccuracy >= 90
      saveLessonProgress(lessonId, passed, finalAccuracy)
      setEndTime(Date.now())
      setStep('result')
    }
  }, [step, currentPos, practiceText, startTime, totalInputs, errors, lessonId])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('beforeinput', handleBeforeInput)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('beforeinput', handleBeforeInput)
    }
  }, [handleKeyPress, handleBeforeInput])

  const accuracy = totalInputs > 0 ? Math.round(((totalInputs - errors) / totalInputs) * 100) : 100
  const timeElapsed = startTime && endTime ? (endTime - startTime) / 1000 : 0
  const passed = accuracy >= 90

  const resetPractice = () => {
    setUserInput('')
    setCurrentPos(0)
    setErrors(0)
    setTotalInputs(0)
    setStartTime(null)
    setEndTime(null)
    setStep('practice')
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)', color: 'var(--fg-1)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">레슨을 찾을 수 없습니다</h1>
          <Link href="/lesson" className="text-blue-400 hover:underline">레슨 목록으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)', color: 'var(--fg-1)' }}>
      <Header />
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/lesson"
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            style={{ background: 'var(--paper-2)', color: 'var(--fg-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            레슨 목록
          </Link>
          <h1 className="text-2xl font-bold">레슨 {lessonId}: {lesson.title}</h1>
          <div></div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-12">
          {(['explanation', 'practice', 'result'] as const).map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  step === stepName ? 'ring-2 ring-offset-2 ring-[var(--accent)] ring-offset-[var(--ink)]' : ''
                }`}
                style={{
                  background: step === stepName ? 'var(--accent)' : 'var(--paper-2)',
                  color: step === stepName ? 'var(--accent-ink)' : 'var(--fg-3)'
                }}
              >
                {index + 1}
              </div>
              {index < 2 && (
                <div
                  className="w-16 h-1 mx-2"
                  style={{ background: step === 'result' && index === 1 ? 'var(--accent)' : 'var(--paper-2)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {step === 'explanation' && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">{lesson.title}</h2>
              <p className="text-lg" style={{ color: 'var(--fg-2)' }}>
                {lesson.description}
              </p>
              <div
                className="p-6 rounded-lg"
                style={{ background: 'var(--paper)', border: `1px solid var(--rule)` }}
              >
                <p className="text-sm mb-4" style={{ color: 'var(--fg-3)' }}>연습할 키들:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {lesson.keyHighlight.map((key: string) => (
                    <span
                      key={key}
                      className="px-3 py-2 rounded font-mono text-lg"
                      style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep('practice')}
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:opacity-80"
                style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
              >
                연습 시작
              </button>
            </div>
          )}

          {step === 'practice' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{lesson.title} 연습</h2>
                <div className="flex justify-center gap-6 text-sm" style={{ color: 'var(--fg-3)' }}>
                  <span>진행률: {Math.round((currentPos / practiceText.length) * 100)}%</span>
                  <span>정확도: {accuracy}%</span>
                  <span>오타: {errors}번</span>
                </div>
              </div>

              <div
                className="p-8 rounded-lg font-mono text-xl leading-relaxed"
                style={{ background: 'var(--paper)', border: `1px solid var(--rule)` }}
              >
                {practiceText.split('').map((char: string, index: number) => {
                  let className = ''
                  const style: CSSProperties = {}

                  if (index < currentPos) {
                    if (userInput[index] === char) {
                      style.color = 'var(--good)'
                    } else {
                      style.color = 'var(--bad)'
                      style.background = 'var(--bad-wash)'
                    }
                  } else if (index === currentPos) {
                    className = 'animate-pulse'
                    style.background = 'var(--accent)'
                    style.color = 'var(--accent-ink)'
                  } else {
                    style.color = 'var(--fg-3)'
                  }

                  return (
                    <span key={index} className={className} style={style}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  )
                })}
              </div>

              <div className="text-center text-sm" style={{ color: 'var(--fg-3)' }}>
                키보드로 위 텍스트를 입력해보세요. 틀렸을 때는 Backspace로 수정할 수 있습니다.
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">연습 완료!</h2>

              <div
                className="inline-block px-6 py-3 rounded-full text-lg font-semibold"
                style={{
                  background: passed ? 'var(--good)' : 'var(--warn)',
                  color: 'var(--ink)'
                }}
              >
                {passed ? '통과!' : '재시도 권장'}
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">{accuracy}%</div>
                  <div style={{ color: 'var(--fg-3)' }}>정확도</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{errors}</div>
                  <div style={{ color: 'var(--fg-3)' }}>오타</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeElapsed.toFixed(1)}s</div>
                  <div style={{ color: 'var(--fg-3)' }}>소요시간</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetPractice}
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
                  style={{ background: 'var(--paper-2)', color: 'var(--fg-1)', border: `1px solid var(--rule)` }}
                >
                  다시 연습
                </button>
                {lessonId !== '11' && (
                  <button
                    onClick={() => router.push(`/lesson/${parseInt(lessonId) + 1}`)}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
                    style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                  >
                    다음 레슨
                  </button>
                )}
                <Link
                  href="/lesson"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
                  style={{ background: 'var(--paper-2)', color: 'var(--fg-1)', border: `1px solid var(--rule)` }}
                >
                  레슨 목록
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
