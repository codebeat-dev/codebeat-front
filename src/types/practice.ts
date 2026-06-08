export type Language = {
  id: string
  ext: string
  name: string
  sub: string
  hint: string
}

export type Difficulty = {
  id: string
  name: string
  en: string
  desc: string
  target: string
  level: number
  minutes: number
}

export type PracticeSession = {
  language: Language
  difficulty: Difficulty
  startTime?: Date
  endTime?: Date
  cpm?: number
  accuracy?: number
}