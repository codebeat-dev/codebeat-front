'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export const Header = () => {
  const router = useRouter()
  const { isLoggedIn, user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--rule)]" style={{ background: 'var(--paper)' }}>
      <Link href="/" className="flex items-baseline gap-0">
        <span className="font-[var(--font-mono)] font-bold text-2xl text-[var(--fg-1)]">CodeBeat</span>
        <span className="font-[var(--font-mono)] font-bold text-2xl text-[var(--accent)]">_</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/lesson" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
          키보드 레슨
        </Link>
        <Link href="/keyboard" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
          자리 연습
        </Link>
        <Link href="/setup" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
          코드 연습
        </Link>
        <Link href="/ranking" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
          랭킹
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="font-[var(--font-mono)] text-xs text-[var(--fg-4)]">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-[var(--fg-3)] hover:text-[var(--bad)] border border-[var(--rule)] hover:border-[var(--bad)]/40 px-2.5 py-1 rounded-lg transition-colors font-[var(--font-mono)]"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
              로그인
            </Link>
            <Link href="/signup" className="text-xs text-[var(--ink)] bg-[var(--accent)] hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity font-medium">
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
