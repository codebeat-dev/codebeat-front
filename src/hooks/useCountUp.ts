import { useState, useEffect } from 'react'

export const useCountUp = (target: number, durationMs: number = 900): number => {
  const [value, setValue] = useState(() =>
    (typeof document !== 'undefined' && document.hidden) ? target : 0
  )

  useEffect(() => {
    let rafId: number
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(Math.round(target * eased))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [target, durationMs])

  return value
}
