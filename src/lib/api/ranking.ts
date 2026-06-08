import client from './client'

export type RankingEntry = {
  rank: number
  user_id: string
  username: string
  best_cpm: number
  best_accuracy: number
  updated_at: string
}

export type RankingResponse = {
  language: string
  category: string | null
  rankings: RankingEntry[]
  my_rank: number | null
}

export const getRanking = async (language: string, category?: string): Promise<RankingResponse> => {
  const { data } = await client.get<RankingResponse>('/ranking', {
    params: { language, ...(category ? { category } : {}) },
  })
  return data
}
