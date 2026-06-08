'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common'
import { register, getMe } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setIsLoading(true)

    try {
      const { access_token } = await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      })
      localStorage.setItem('access_token', access_token)
      const user = await getMe()
      setAuth(access_token, user)
      router.push('/setup')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? '이미 사용 중인 이메일 또는 이름입니다.')
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-[var(--fg-1)] mb-2">회원가입</h1>
          <p className="text-[var(--fg-3)]">무료 계정을 만들고 코딩 타자 연습을 시작하세요</p>
        </div>

        {/* Signup Form */}
        <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-6">
          {error && (
            <p className="mb-4 text-sm text-[var(--bad)] bg-[var(--bad)]/10 border border-[var(--bad)]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--fg-2)] mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--fg-2)] mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--fg-2)] mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {isLoading ? '계정 생성 중...' : '계정 만들기'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--fg-3)] text-sm">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors">
                로그인
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[var(--fg-4)] text-xs">
              계정을 만들면{' '}
              <a href="#" className="text-[var(--accent)] hover:underline">서비스 약관</a>과{' '}
              <a href="#" className="text-[var(--accent)] hover:underline">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
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
