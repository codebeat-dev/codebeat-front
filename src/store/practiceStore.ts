import { create } from 'zustand'
import type { CodeExampleResponse } from '@/lib/api/code'

type PracticeState = {
  language: string | null
  difficulty: string | null
  codeExample: CodeExampleResponse | null
  setLanguage: (language: string) => void
  setDifficulty: (difficulty: string) => void
  setCodeExample: (example: CodeExampleResponse) => void
  reset: () => void
}

export const usePracticeStore = create<PracticeState>()((set) => ({
  language: null,
  difficulty: null,
  codeExample: null,

  setLanguage: (language) => set({ language }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setCodeExample: (codeExample) => set({ codeExample }),

  reset: () => set({ language: null, difficulty: null, codeExample: null }),
}))
