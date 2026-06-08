const CONFETTI_PIECES = Array.from({ length: 32 }).map((_, i) => ({
  left: (i * 23) % 100,
  delay: ((i * 7) % 16) / 10,
  color: ['var(--accent)', 'var(--good)', 'var(--warn)', 'var(--accent-2)'][i % 4],
  size: 3 + (i % 5),
  rotation: (i * 47) % 360,
}))

export const ConfettiLayer = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes confetti-fall {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          10% { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg); }
        }
        .confetti-piece {
          animation: confetti-fall 3.6s cubic-bezier(0.4,0,0.4,1) forwards;
        }
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {CONFETTI_PIECES.map((piece, i) => (
          <span
            key={i}
            className="absolute -top-2.5 w-1 h-1 opacity-0 confetti-piece"
            style={{
              left: `${piece.left}%`,
              background: piece.color,
              width: piece.size,
              height: piece.size,
              transform: `rotate(${piece.rotation}deg)`,
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
