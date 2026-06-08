import { useState, useRef, useEffect, useCallback } from 'react'

export type TypingState = {
  currentIndex: number
  input: string
  errors: number
  startTime: number | null
  isComplete: boolean
  cpm: number
  accuracy: number
}

export type CharacterState = 'pending' | 'correct' | 'incorrect' | 'current'

export const useTyping = (targetText: string) => {
  const [state, setState] = useState<TypingState>({
    currentIndex: 0,
    input: '',
    errors: 0,
    startTime: null,
    isComplete: false,
    cpm: 0,
    accuracy: 100
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const calculateMetrics = useCallback((currentInput: string, currentErrors: number, startTime: number) => {
    const elapsed = (Date.now() - startTime) / 1000 / 60 // minutes
    const cpm = elapsed > 0 ? Math.round(currentInput.length / elapsed) : 0
    const totalInputs = currentInput.length + currentErrors
    const accuracy = totalInputs > 0 ? Math.round((currentInput.length / totalInputs) * 100) : 100

    return { cpm, accuracy }
  }, [])

  const updateMetrics = useCallback(() => {
    if (!state.startTime) return

    const metrics = calculateMetrics(state.input, state.errors, state.startTime)
    setState(prev => ({
      ...prev,
      cpm: metrics.cpm,
      accuracy: metrics.accuracy
    }))
  }, [state.startTime, state.input, state.errors, calculateMetrics])

  useEffect(() => {
    if (state.startTime && !state.isComplete) {
      intervalRef.current = setInterval(updateMetrics, 100)
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [state.startTime, state.isComplete, updateMetrics])

  const handleKeyPress = useCallback((key: string) => {
    setState(prev => {
      const newState = { ...prev }

      // Start timer on first keypress
      if (!newState.startTime) {
        newState.startTime = Date.now()
      }

      if (key === 'Backspace') {
        if (newState.input.length > 0) {
          newState.input = newState.input.slice(0, -1)
          newState.currentIndex = Math.max(0, newState.currentIndex - 1)
        }
      } else if (key.length === 1) {
        const targetChar = targetText[newState.currentIndex]

        if (key === targetChar) {
          newState.input += key
          newState.currentIndex += 1
        } else {
          // 오타 발생: 에러 카운트 증가하고 잘못된 문자를 input에 추가
          newState.errors += 1
          newState.input += key  // 잘못 입력한 문자도 기록
          newState.currentIndex += 1  // 커서는 다음 위치로 이동
        }

        // Check if complete
        if (newState.currentIndex >= targetText.length) {
          newState.isComplete = true
        }
      }

      // Calculate metrics
      if (newState.startTime) {
        const metrics = calculateMetrics(newState.input, newState.errors, newState.startTime)
        newState.cpm = metrics.cpm
        newState.accuracy = metrics.accuracy
      }

      return newState
    })
  }, [targetText, calculateMetrics])

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      input: '',
      errors: 0,
      startTime: null,
      isComplete: false,
      cpm: 0,
      accuracy: 100
    })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const getCharacterState = useCallback((index: number): CharacterState => {
    if (index < state.input.length) {
      return targetText[index] === state.input[index] ? 'correct' : 'incorrect'
    }
    if (index === state.currentIndex) {
      return 'current'
    }
    return 'pending'
  }, [state.input, state.currentIndex, targetText])

  return {
    state,
    handleKeyPress,
    reset,
    getCharacterState
  }
}
