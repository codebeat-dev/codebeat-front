import Link from 'next/link'
import { Button, PlayIcon } from '@/components/common'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ink)] via-[var(--paper)] to-[var(--ink)]">
      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-baseline gap-0">
          <span className="font-[var(--font-mono)] font-bold text-2xl text-[var(--fg-1)]">CodeBeat</span>
          <span className="font-[var(--font-mono)] font-bold text-2xl text-[var(--accent)]">_</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors text-sm">
            로그인
          </Link>
          <Link href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors text-sm font-medium">
            회원가입
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[var(--fg-1)]">코딩 타자,</span><br />
            <span className="text-[var(--accent)]">이제 게임처럼</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[var(--fg-2)] mb-8 leading-relaxed">
            문법을 외우지 말고 <span className="text-[var(--accent)]">손으로 익히세요</span><br />
            AI가 생성하는 코드로 자연스럽게 특수문자와 패턴을 체득할 수 있습니다
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <Link href="/signup">
              <Button
                variant="primary"
                icon={<PlayIcon />}
                className="px-8 py-4 text-lg font-semibold hover:scale-105 transform transition-all shadow-lg hover:shadow-xl"
              >
                무료로 시작하기
              </Button>
            </Link>
            <p className="text-[var(--fg-4)] text-sm mt-3">
              회원가입 후 바로 연습 시작 · 신용카드 불필요
            </p>
          </div>

          {/* Quick Start Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Link href="/lesson" className="block group">
              <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-8 hover:border-[var(--accent)] transition-all duration-300 group-hover:bg-[var(--paper-3)]">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-[var(--fg-1)] mb-3">키보드 레슨</h3>
                <p className="text-[var(--fg-3)] text-sm mb-4">
                  기초부터 차근차근<br />
                  11단계 손가락 자리 연습
                </p>
                <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium group-hover:gap-3 transition-all">
                  레슨 시작하기
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/keyboard" className="block group">
              <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-8 hover:border-[var(--accent)] transition-all duration-300 group-hover:bg-[var(--paper-3)]">
                <div className="text-4xl mb-4">⌨️</div>
                <h3 className="text-xl font-semibold text-[var(--fg-1)] mb-3">자리 연습</h3>
                <p className="text-[var(--fg-3)] text-sm mb-4">
                  키보드 시각화와 손가락 가이드<br />
                  올바른 타이핑 자세 익히기
                </p>
                <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium group-hover:gap-3 transition-all">
                  연습 시작하기
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-6 hover:border-[var(--rule-2)] transition-colors">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-[var(--fg-1)] mb-2">언어 선택</h3>
              <p className="text-[var(--fg-3)] text-sm">
                Python, JavaScript, Java, C, SQL<br />
                각 언어의 문법 특성에 맞는 연습
              </p>
            </div>

            <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-6 hover:border-[var(--rule-2)] transition-colors">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-[var(--fg-1)] mb-2">실시간 측정</h3>
              <p className="text-[var(--fg-3)] text-sm">
                CPM (Characters Per Minute)<br />
                정확도와 속도를 실시간으로 확인
              </p>
            </div>

            <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-6 hover:border-[var(--rule-2)] transition-colors">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-[var(--fg-1)] mb-2">성장 리포트</h3>
              <p className="text-[var(--fg-3)] text-sm">
                개인 기록 추적과 랭킹 시스템<br />
                꾸준한 실력 향상을 확인하세요
              </p>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-xl p-8 mb-16">
            <h3 className="text-xl font-semibold text-[var(--fg-1)] mb-6">VSCode 스타일 에디터에서 연습</h3>
            <div className="bg-[var(--ink)] rounded-lg p-6 font-[var(--font-mono)] text-sm">
              <div className="flex gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[var(--bad)]"></span>
                <span className="w-3 h-3 rounded-full bg-[var(--warn)]"></span>
                <span className="w-3 h-3 rounded-full bg-[var(--good)]"></span>
              </div>
              <div className="text-left">
                <span className="text-[var(--syn-key)]">def</span>
                <span className="text-[var(--fg-1)]"> fibonacci(n):</span><br />
                <span className="text-[var(--fg-4)]">    </span>
                <span className="text-[var(--syn-key)]">if</span>
                <span className="text-[var(--fg-1)]"> n &lt; 2:</span><br />
                <span className="text-[var(--fg-4)]">        </span>
                <span className="text-[var(--syn-key)]">return</span>
                <span className="text-[var(--fg-1)]"> n</span><br />
                <span className="text-[var(--fg-4)]">    </span>
                <span className="text-[var(--syn-key)]">return</span>
                <span className="text-[var(--fg-1)]"> fibonacci(n-1) + fibonacci(n-2)</span>
                <span className="inline-block w-2 h-5 bg-[var(--accent)] ml-1 animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[var(--fg-1)] mb-4">
              코딩 실력, 타이핑부터 시작하세요
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" className="px-6 py-3">
                  회원가입하고 시작하기
                </Button>
              </Link>
              <Link href="/setup">
                <Button variant="secondary" className="px-6 py-3">
                  둘러보기 (로그인 없이)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--rule)] mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-baseline gap-0">
              <span className="font-[var(--font-mono)] font-bold text-lg text-[var(--fg-2)]">CodeBeat</span>
              <span className="font-[var(--font-mono)] font-bold text-lg text-[var(--accent)]">_</span>
            </div>
            <div className="text-[var(--fg-4)] text-sm">
              © 2026 CodeBeat. 코드를 치며 형태를 익히는 타자연습 서비스
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
