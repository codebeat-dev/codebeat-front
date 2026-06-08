import Header from '@/components/common/Header'

export default function ProfilePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)', color: 'var(--fg-1)' }}>
      <Header />
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">프로필</h1>
          <p className="text-lg" style={{ color: 'var(--fg-2)' }}>
            곧 출시 예정입니다.
          </p>
        </div>
      </div>
    </div>
  )
}