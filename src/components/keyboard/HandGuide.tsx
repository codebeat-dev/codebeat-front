type HandGuideProps = {
  activeFingers: string[]
}

const HandGuide = ({ activeFingers }: HandGuideProps) => {
  const isActive = (finger: string) => activeFingers.includes(finger)

  return (
    <div className="flex justify-center">
      <svg width="480" height="300" viewBox="0 0 480 300" className="max-w-full h-auto">
        {/* Background */}
        <rect width="480" height="300" rx="20" fill="var(--paper)" stroke="var(--rule)" strokeWidth="1"/>

        {/* Palm */}
        <ellipse cx="240" cy="200" rx="120" ry="60" fill="var(--fg-4)" opacity="0.3"/>

        {/* Left Hand Fingers */}
        {/* Left Pinky */}
        <rect
          x="100" y="80" width="28" height="100" rx="14"
          fill={isActive('left-pinky') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Left Ring */}
        <rect
          x="140" y="60" width="28" height="120" rx="14"
          fill={isActive('left-ring') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Left Middle */}
        <rect
          x="180" y="50" width="28" height="130" rx="14"
          fill={isActive('left-middle') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Left Index */}
        <rect
          x="220" y="70" width="28" height="110" rx="14"
          fill={isActive('left-index') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Left Thumb */}
        <ellipse
          cx="190" cy="230" rx="20" ry="35"
          fill={isActive('left-thumb') ? '#F97316' : 'var(--fg-4)'}
          transform="rotate(-30 190 230)"
        />

        {/* Right Hand Fingers */}
        {/* Right Index */}
        <rect
          x="270" y="70" width="28" height="110" rx="14"
          fill={isActive('right-index') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Right Middle */}
        <rect
          x="310" y="50" width="28" height="130" rx="14"
          fill={isActive('right-middle') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Right Ring */}
        <rect
          x="350" y="60" width="28" height="120" rx="14"
          fill={isActive('right-ring') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Right Pinky */}
        <rect
          x="390" y="80" width="28" height="100" rx="14"
          fill={isActive('right-pinky') ? '#F97316' : 'var(--fg-4)'}
        />

        {/* Right Thumb */}
        <ellipse
          cx="290" cy="230" rx="20" ry="35"
          fill={isActive('right-thumb') ? '#F97316' : 'var(--fg-4)'}
          transform="rotate(30 290 230)"
        />

        {/* Finger Labels */}
        <text x="114" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">L5</text>
        <text x="154" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">L4</text>
        <text x="194" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">L3</text>
        <text x="234" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">L2</text>
        <text x="190" y="280" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">L1</text>

        <text x="284" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">R2</text>
        <text x="324" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">R3</text>
        <text x="364" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">R4</text>
        <text x="404" y="200" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">R5</text>
        <text x="290" y="280" textAnchor="middle" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-mono)">R1</text>
      </svg>
    </div>
  )
}

export default HandGuide