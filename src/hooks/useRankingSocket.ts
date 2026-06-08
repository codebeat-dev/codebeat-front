import { useEffect, useRef, useState } from 'react'
import { createRankingSocket } from '@/lib/ws/rankingSocket'
import type { RankingResponse } from '@/lib/api/ranking'

export const useRankingSocket = (language: string | null) => {
  const [ranking, setRanking] = useState<RankingResponse | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!language) return

    wsRef.current = createRankingSocket({
      language,
      onMessage: (data) => setRanking(data),
    })

    return () => {
      wsRef.current?.close()
    }
  }, [language])

  return ranking
}
