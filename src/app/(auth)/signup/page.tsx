'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common'
import { register, getMe } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const getPasswordStrength = (pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } => {
  if (pw.length === 0) return { level: 0, label: '', color: '' }
  if (pw.length < 6) return { level: 1, label: '너무 짧음', color: 'var(--bad)' }
  if (pw.length < 10) return { level: 2, label: '보통', color: 'var(--warn)' }
  return { level: 3, label: '강함', color: 'var(--good)' }
}

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordMismatch = touched.confirmPassword && formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword
  const passwordMatch = touched.confirmPassword && formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
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
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline gap-0 mb-6">
            <span className="font-[var(--font-mono)] font-bold text-3xl text-[var(--fg-1)]">CodeBeat</span>
            <span className="font-[var(--font-mono)] font-bold text-3xl text-[var(--accent)]">_</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--fg-1)] mb-2">회원가입</h1>
          <p className="text-[var(--fg-3)] text-sm">무료 계정을 만들고 코딩 타자 연습을 시작하세요</p>
        </div>

        {/* 폼 */}
        <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-6">
          {error && (
            <div className="mb-5 flex items-start gap-2 text-sm text-[var(--bad)] bg-[var(--bad)]/10 border border-[var(--bad)]/20 rounded-lg px-3 py-2.5">
              <span className="mt-px">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--fg-2)] mb-1.5">
                이름 <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="username"
                className="w-full px-3 py-2.5 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="사용할 닉네임을 입력하세요"
              />
              {touched.name && formData.name.length === 0 && (
                <p className="mt-1 text-xs text-[var(--bad)]">이름을 입력해주세요</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--fg-2)] mb-1.5">
                이메일 <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--fg-2)] mb-1.5">
                비밀번호 <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="new-password"
                className="w-full px-3 py-2.5 bg-[var(--ink)] border border-[var(--rule)] rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="6자 이상 입력하세요"
              />
              {/* 비밀번호 강도 */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= passwordStrength.level
                            ? passwordStrength.color
                            : 'var(--rule-2)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--fg-2)] mb-1.5">
                비밀번호 확인 <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="new-password"
                className={`w-full px-3 py-2.5 bg-[var(--ink)] border rounded-lg text-[var(--fg-1)] placeholder-[var(--fg-4)] focus:outline-none transition-colors ${
                  passwordMismatch
                    ? 'border-[var(--bad)] focus:border-[var(--bad)]'
                    : passwordMatch
                    ? 'border-[var(--good)] focus:border-[var(--good)]'
                    : 'border-[var(--rule)] focus:border-[var(--accent)]'
                }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {passwordMismatch && (
                <p className="mt-1 text-xs text-[var(--bad)]">비밀번호가 일치하지 않습니다</p>
              )}
              {passwordMatch && (
                <p className="mt-1 text-xs text-[var(--good)]">비밀번호가 일치합니다</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || passwordStrength.level < 1}
              className="w-full mt-2"
            >
              {isLoading ? '계정 생성 중...' : '계정 만들기'}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-[var(--fg-3)] text-sm">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-[var(--accent)] hover:underline transition-colors">
                로그인
              </Link>
            </p>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[var(--fg-5)] text-xs">
              계정을 만들면{' '}
              <a href="#" className="text-[var(--fg-4)] hover:underline">서비스 약관</a>과{' '}
              <a href="#" className="text-[var(--fg-4)] hover:underline">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>

        {/* 로그인 없이 */}
        <div className="mt-5 text-center">
          <p className="text-[var(--fg-4)] text-xs mb-3">또는</p>
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
