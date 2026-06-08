import Link from 'next/link'

export const Header = () => {
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
        <Link href="/login" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
          로그인
        </Link>
        <Link href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors text-sm font-medium">
          회원가입
        </Link>
      </div>
    </header>
  )
}

export default Header
