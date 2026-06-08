'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/common'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: 실제 로그인 API 호출
    setTimeout(() => {
      setIsLoading(false)
      // 로그인 성공 후 /setup으로 리다이렉트
      window.location.href = '/setup'
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ink)] via-[var(--paper)] to-[var(--ink)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline gap-0 mb-6">
            <span className="font-[var(--font-mono)] font-bold text-3xl text-[var(--fg-1)]">CodeBeat</span>
            <span className="font-[var(--font-mono)] font-bold text-3xl text-[var(--accent)]">_</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--fg-1)] mb-2">로그인</h1>
          <p className="text-[var(--fg-3)]">계정에 로그인하여 연습을 계속하세요</p>
        </div>

        {/* Login Form */}
        <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--fg-2)] mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--fg-2)] mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--fg-3)] text-sm">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-6 text-center">
          <p className="text-[var(--fg-4)] text-sm mb-3">또는</p>
          <Link href="/setup">
            <Button variant="secondary" className="w-full">
              로그인 없이 둘러보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
