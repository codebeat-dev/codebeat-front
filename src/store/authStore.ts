import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserResponse } from '@/lib/api/auth'

type AuthState = {
  token: string | null
  user: UserResponse | null
  isLoggedIn: boolean
  setAuth: (token: string, user: UserResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      setAuth: (token, user) => {
        localStorage.setItem('access_token', token)
        set({ token, user, isLoggedIn: true })
      },

      clearAuth: () => {
        localStorage.removeItem('access_token')
        set({ token: null, user: null, isLoggedIn: false })
      },
    }),
    {
      name: 'auth',
      partialize: (state) => ({ token: state.token, user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
)
