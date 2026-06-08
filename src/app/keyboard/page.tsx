'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'
import Header from '@/components/common/Header'
import KeyboardVisualization from '@/components/keyboard/KeyboardVisualization'
import HandGuide from '@/components/keyboard/HandGuide'

const practiceTexts = [
  'asdf jkl; asdf jkl;', // 홈포지션
  'qwerty uiop qwerty', // 상단 행
  'zxcv bnm zxcv bnm', // 하단 행
  '1234567890 1234567890', // 숫자
  '!@#$%^&* !@#$%^&*', // 특수문자
  'function() { return; }', // 종합 연습
]

const getFingerForKey = (key: string): string => {
  const fingerMap: Record<string, string> = {
    // Left hand
    'q': 'left-pinky', 'a': 'left-pinky', 'z': 'left-pinky', '1': 'left-pinky', '`': 'left-pinky',
    'w': 'left-ring', 's': 'left-ring', 'x': 'left-ring', '2': 'left-ring',
    'e': 'left-middle', 'd': 'left-middle', 'c': 'left-middle', '3': 'left-middle',
    'r': 'left-index', 'f': 'left-index', 'v': 'left-index', 't': 'left-index', 'g': 'left-index', 'b': 'left-index',
    '4': 'left-index', '5': 'left-index',

    // Right hand
    'y': 'right-index', 'h': 'right-index', 'n': 'right-index', 'u': 'right-index', 'j': 'right-index', 'm': 'right-index',
    '6': 'right-index', '7': 'right-index',
    'i': 'right-middle', 'k': 'right-middle', ',': 'right-middle', '8': 'right-middle',
    'o': 'right-ring', 'l': 'right-ring', '.': 'right-ring', '9': 'right-ring',
    'p': 'right-pinky', ';': 'right-pinky', '/': 'right-pinky', '0': 'right-pinky', '[': 'right-pinky',
    ']': 'right-pinky', "'": 'right-pinky', '-': 'right-pinky', '=': 'right-pinky',

    // Thumbs
    ' ': 'left-thumb',
  }

  return fingerMap[key.toLowerCase()] || 'unknown'
}

export default function KeyboardPage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentPos, setCurrentPos] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [errors, setErrors] = useState(0)
  const [totalInputs, setTotalInputs] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [pressedKeys, setPressedKeys] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const currentText = practiceTexts[currentTextIndex]
  const nextChar = currentText[currentPos]
  const expectedFinger = nextChar ? getFingerForKey(nextChar) : ''

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isCompleted) return

    // Add to pressed keys for visual feedback
    if (!pressedKeys.includes(e.key.toLowerCase())) {
      setPressedKeys(prev => [...prev, e.key.toLowerCase()])
    }
  }, [pressedKeys, isCompleted])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Remove from pressed keys
    setPressedKeys(prev => prev.filter(key => key !== e.key.toLowerCase()))
  }, [])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isCompleted) return

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

    // Handle IME composition (Korean input)
    if (e.key.length === 1) {
      if (e.isComposing || e.keyCode === 229) {
        return
      }

      const expectedChar = currentText[currentPos]
      const isCorrect = e.key === expectedChar

      setUserInput(prev => prev + e.key)
      setTotalInputs(prev => prev + 1)

      if (!isCorrect) {
        setErrors(prev => prev + 1)
      }

      setCurrentPos(prev => prev + 1)

      // Check completion
      if (currentPos + 1 >= currentText.length) {
        setIsCompleted(true)
      }
    }
  }, [currentText, currentPos, startTime, isCompleted])

  const handleBeforeInput = useCallback((e: InputEvent) => {
    if (isCompleted) return

    // Handle composed text (Korean characters)
    if (e.data && e.inputType === 'insertText') {
      e.preventDefault()

      const expectedChar = currentText[currentPos]
      const isCorrect = e.data === expectedChar

      setUserInput(prev => prev + e.data)
      setTotalInputs(prev => prev + 1)

      if (!isCorrect) {
        setErrors(prev => prev + 1)
      }

      setCurrentPos(prev => prev + 1)

      // Check completion
      if (currentPos + 1 >= currentText.length) {
        setIsCompleted(true)
      }
    }
  }, [currentText, currentPos, isCompleted])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('beforeinput', handleBeforeInput)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('beforeinput', handleBeforeInput)
    }
  }, [handleKeyDown, handleKeyUp, handleKeyPress, handleBeforeInput])

  const accuracy = totalInputs > 0 ? Math.round(((totalInputs - errors) / totalInputs) * 100) : 100
  const progress = Math.round((currentPos / currentText.length) * 100)

  const resetPractice = () => {
    setCurrentPos(0)
    setUserInput('')
    setErrors(0)
    setTotalInputs(0)
    setStartTime(null)
    setIsCompleted(false)
    setPressedKeys([])
  }

  const nextPractice = () => {
    if (currentTextIndex < practiceTexts.length - 1) {
      setCurrentTextIndex(prev => prev + 1)
      resetPractice()
    }
  }

  const prevPractice = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex(prev => prev - 1)
      resetPractice()
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)', color: 'var(--fg-1)' }}>
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">키보드 자리 연습</h1>
        </div>

        {/* Practice Text Selection */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={prevPractice}
              disabled={currentTextIndex === 0}
              className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
              style={{ background: 'var(--paper-2)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 6l-4 4 4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold">연습 {currentTextIndex + 1} / {practiceTexts.length}</div>
              <div className="text-sm" style={{ color: 'var(--fg-3)' }}>
                {['홈포지션', '상단 행', '하단 행', '숫자', '특수문자', '종합 연습'][currentTextIndex]}
              </div>
            </div>

            <button
              onClick={nextPractice}
              disabled={currentTextIndex === practiceTexts.length - 1}
              className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
              style={{ background: 'var(--paper-2)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 6l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="flex justify-center gap-6 text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
            <span>진행률: {progress}%</span>
            <span>정확도: {accuracy}%</span>
            <span>오타: {errors}번</span>
          </div>
        </div>

        {/* Practice Text Display */}
        <div className="mb-8">
          <div
            className="p-8 rounded-lg font-mono text-2xl leading-relaxed text-center"
            style={{ background: 'var(--paper)', border: `1px solid var(--rule)` }}
          >
            {currentText.split('').map((char, index) => {
              let className = ''
              const style: CSSProperties = {}

              if (index < currentPos) {
                if (userInput[index] === char) {
                  style.color = 'var(--good)'
                } else {
                  style.color = 'var(--bad)'
                  style.background = 'var(--bad-wash)'
                  style.borderRadius = '4px'
                  style.padding = '0 2px'
                }
              } else if (index === currentPos) {
                className = 'animate-pulse'
                style.background = 'var(--accent)'
                style.color = 'var(--accent-ink)'
                style.borderRadius = '4px'
                style.padding = '0 2px'
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

          {nextChar && (
            <div className="text-center mt-4">
              <p className="text-lg" style={{ color: 'var(--fg-2)' }}>
                다음 키: <span className="font-mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  {nextChar === ' ' ? 'Space' : nextChar}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Completion Modal */}
        {isCompleted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="p-8 rounded-lg max-w-md w-full mx-4"
              style={{ background: 'var(--paper)', border: `1px solid var(--rule)` }}
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">연습 완료!</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold">{accuracy}%</div>
                    <div style={{ color: 'var(--fg-3)' }}>정확도</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{errors}</div>
                    <div style={{ color: 'var(--fg-3)' }}>오타</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetPractice}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
                    style={{ background: 'var(--paper-2)', border: `1px solid var(--rule)` }}
                  >
                    다시 연습
                  </button>
                  {currentTextIndex < practiceTexts.length - 1 && (
                    <button
                      onClick={nextPractice}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-80"
                      style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
                    >
                      다음 연습
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard and Hand Guide */}
        <div className="space-y-8">
          {/* Hand Guide */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">손가락 위치</h3>
            <HandGuide activeFingers={expectedFinger ? [expectedFinger] : []} />
          </div>

          {/* Keyboard Visualization */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">키보드</h3>
            <KeyboardVisualization
              highlightedKeys={nextChar ? [nextChar] : []}
              pressedKeys={pressedKeys}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
            위 텍스트를 보고 키보드로 입력해보세요. 손가락 위치와 키보드 가이드를 참고하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
