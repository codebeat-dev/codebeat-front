import type { RankingResponse } from '@/lib/api/ranking'

type RankingSocketOptions = {
  language: string
  onMessage: (data: RankingResponse) => void
  onError?: (e: Event) => void
}

export const createRankingSocket = ({ language, onMessage, onError }: RankingSocketOptions): WebSocket => {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api')
    .replace(/^http/, 'ws')
  const ws = new WebSocket(`${base}/ranking/ws/${language}`)

  ws.onmessage = (e) => {
    try {
      const data: RankingResponse = JSON.parse(e.data)
      onMessage(data)
    } catch {
      // 파싱 실패 무시
    }
  }

  if (onError) {
    ws.onerror = onError
  }

  return ws
}
