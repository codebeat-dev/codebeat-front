import client from './client'

export type KeystrokeEntry = {
  char: string
  time_ms: number
  is_error: boolean
}

export type SessionCreate = {
  code_example_id: string
  cpm: number
  accuracy: number
  duration_sec: number
  keystroke_data?: KeystrokeEntry[] | null
}

export type WeakPattern = {
  pattern: string
  error_rate: number
}

export type SessionResponse = {
  id: string
  user_id: string
  code_example_id: string
  cpm: number
  accuracy: number
  duration_sec: number
  ai_feedback: string | null
  weak_patterns: WeakPattern[] | null
  played_at: string
}

export const createSession = async (body: SessionCreate): Promise<SessionResponse> => {
  const { data } = await client.post<SessionResponse>('/sessions', body)
  return data
}

export const getSessions = async (): Promise<SessionResponse[]> => {
  const { data } = await client.get<SessionResponse[]>('/sessions')
  return data
}

export const getSession = async (sessionId: string): Promise<SessionResponse> => {
  const { data } = await client.get<SessionResponse>(`/sessions/${sessionId}`)
  return data
}
