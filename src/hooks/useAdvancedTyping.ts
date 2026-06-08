import { useState, useCallback, useMemo } from 'react'
import type { CharToken, LineData } from '@/lib/tokenizer'

export type HistoryEntry = {
  ok: boolean
  actual: string
  auto?: boolean  // auto-filled during indent skip
}

export type TypingStats = {
  pos: number
  history: HistoryEntry[]
  errors: number
  totalKeys: number
  startTime: number | null
  endTime: number | null
  paused: boolean
  pauseAccum: number
  pauseStart: number | null
}

export type CharState = 'pending' | 'correct' | 'incorrect' | 'cursor'

export const useAdvancedTyping = (
  chars: CharToken[],
  lines: LineData[],
  autoIndent: boolean = true
) => {
  const [state, setState] = useState<TypingStats>({
    pos: 0,
    history: [],
    errors: 0,
    totalKeys: 0,
    startTime: null,
    endTime: null,
    paused: false,
    pauseAccum: 0,
    pauseStart: null
  })

  const [now, setNow] = useState(0)

  // Derived metrics
  const elapsedMs = useMemo(() => {
    if (!state.startTime) return 0
    const end = state.endTime ?? (state.paused ? state.pauseStart : now)
    return Math.max(0, (end || now) - state.startTime - state.pauseAccum)
  }, [state.startTime, state.endTime, now, state.paused, state.pauseStart, state.pauseAccum])

  const correctChars = useMemo(() =>
    state.history.filter(h => h && h.ok).length, [state.history])

  const cpm = useMemo(() => {
    if (elapsedMs < 500) return 0
    return Math.round(correctChars / (elapsedMs / 60000))
  }, [correctChars, elapsedMs])

  const accuracy = useMemo(() => {
    if (state.totalKeys === 0) return 100
    return Math.max(0, Math.round((state.totalKeys - state.errors) / state.totalKeys * 100))
  }, [state.totalKeys, state.errors])

  const progress = chars.length ? state.pos / chars.length : 0

  const reset = useCallback(() => {
    setState({
      pos: 0,
      history: [],
      errors: 0,
      totalKeys: 0,
      startTime: null,
      endTime: null,
      paused: false,
      pauseAccum: 0,
      pauseStart: null
    })
    setNow(Date.now())
  }, [])

  const togglePause = useCallback(() => {
    if (!state.startTime || state.endTime) return

    setState(prev => {
      if (prev.paused) {
        // resuming
        const newPauseAccum = prev.pauseStart ?
          prev.pauseAccum + (Date.now() - prev.pauseStart) : prev.pauseAccum
        return {
          ...prev,
          paused: false,
          pauseAccum: newPauseAccum,
          pauseStart: null
        }
      } else {
        // pausing
        return {
          ...prev,
          paused: true,
          pauseStart: Date.now()
        }
      }
    })
  }, [state.startTime, state.endTime])

  const skipIndent = useCallback((chars: CharToken[], pos: number): number => {
    let p = pos
    while (p < chars.length && chars[p].ch === ' ') p++
    return p
  }, [])

  const handleKeyPress = useCallback((key: string) => {
    if (state.endTime || state.paused) return false

    setState(prev => {
      const newState = { ...prev }

      // Start timer on first keystroke
      if (!newState.startTime) {
        newState.startTime = Date.now()
      }

      if (key === 'Backspace') {
        if (newState.pos === 0) return prev
        const newPos = newState.pos - 1
        newState.pos = newPos
        newState.history = newState.history.slice(0, newPos)
        return newState
      }

      if (newState.pos >= chars.length) return prev

      // Handle regular keypress
      const expected = chars[newState.pos].ch
      const ok = key === expected

      newState.history = [...newState.history]
      newState.history[newState.pos] = { ok, actual: key }
      newState.totalKeys += 1

      if (!ok) {
        newState.errors += 1
      }

      let newPos = newState.pos + 1

      // Auto-indent: after a correctly-typed newline, skip the next line's leading spaces
      if (autoIndent && ok && expected === '\n' && newPos < chars.length) {
        const skipTo = skipIndent(chars, newPos)
        // Mark skipped chars as 'auto-correct'
        for (let p = newPos; p < skipTo; p++) {
          newState.history[p] = { ok: true, actual: chars[p].ch, auto: true }
        }
        newPos = skipTo
      }

      newState.pos = newPos

      // Check completion
      if (newPos >= chars.length) {
        newState.endTime = Date.now()
      }

      return newState
    })

    return true
  }, [chars, state.endTime, state.paused, autoIndent, skipIndent])

  const getCharState = useCallback((index: number): CharState => {
    if (index === state.pos && !state.endTime) return 'cursor'

    const historyEntry = state.history[index]
    if (!historyEntry) return 'pending'

    return historyEntry.ok ? 'correct' : 'incorrect'
  }, [state.pos, state.history, state.endTime])

  const formatTime = useCallback((ms: number): string => {
    const total = Math.floor(ms / 1000)
    const m = Math.floor(total / 60).toString().padStart(2, '0')
    const s = (total % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }, [])

  return {
    // State
    pos: state.pos,
    history: state.history,
    startTime: state.startTime,
    endTime: state.endTime,
    paused: state.paused,
    errors: state.errors,
    totalKeys: state.totalKeys,

    // Metrics
    cpm,
    accuracy,
    progress,
    elapsedMs,
    timeStr: formatTime(elapsedMs),

    // Actions
    handleKeyPress,
    reset,
    togglePause,
    getCharState,
    setNow
  }
}
