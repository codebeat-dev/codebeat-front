type KeyboardVisualizationProps = {
  highlightedKeys: string[]
  pressedKeys: string[]
}

type KeyInfo = {
  key: string
  display: string
  finger: string
  width?: number
  row: number
  col: number
}

const keyLayout: KeyInfo[] = [
  // Number row
  { key: '`', display: '`', finger: 'left-pinky', row: 0, col: 0 },
  { key: '1', display: '1', finger: 'left-pinky', row: 0, col: 1 },
  { key: '2', display: '2', finger: 'left-ring', row: 0, col: 2 },
  { key: '3', display: '3', finger: 'left-middle', row: 0, col: 3 },
  { key: '4', display: '4', finger: 'left-index', row: 0, col: 4 },
  { key: '5', display: '5', finger: 'left-index', row: 0, col: 5 },
  { key: '6', display: '6', finger: 'right-index', row: 0, col: 6 },
  { key: '7', display: '7', finger: 'right-index', row: 0, col: 7 },
  { key: '8', display: '8', finger: 'right-middle', row: 0, col: 8 },
  { key: '9', display: '9', finger: 'right-ring', row: 0, col: 9 },
  { key: '0', display: '0', finger: 'right-pinky', row: 0, col: 10 },
  { key: '-', display: '-', finger: 'right-pinky', row: 0, col: 11 },
  { key: '=', display: '=', finger: 'right-pinky', row: 0, col: 12 },

  // Top row
  { key: 'q', display: 'Q', finger: 'left-pinky', row: 1, col: 1 },
  { key: 'w', display: 'W', finger: 'left-ring', row: 1, col: 2 },
  { key: 'e', display: 'E', finger: 'left-middle', row: 1, col: 3 },
  { key: 'r', display: 'R', finger: 'left-index', row: 1, col: 4 },
  { key: 't', display: 'T', finger: 'left-index', row: 1, col: 5 },
  { key: 'y', display: 'Y', finger: 'right-index', row: 1, col: 6 },
  { key: 'u', display: 'U', finger: 'right-index', row: 1, col: 7 },
  { key: 'i', display: 'I', finger: 'right-middle', row: 1, col: 8 },
  { key: 'o', display: 'O', finger: 'right-ring', row: 1, col: 9 },
  { key: 'p', display: 'P', finger: 'right-pinky', row: 1, col: 10 },
  { key: '[', display: '[', finger: 'right-pinky', row: 1, col: 11 },
  { key: ']', display: ']', finger: 'right-pinky', row: 1, col: 12 },

  // Home row
  { key: 'a', display: 'A', finger: 'left-pinky', row: 2, col: 1 },
  { key: 's', display: 'S', finger: 'left-ring', row: 2, col: 2 },
  { key: 'd', display: 'D', finger: 'left-middle', row: 2, col: 3 },
  { key: 'f', display: 'F', finger: 'left-index', row: 2, col: 4 },
  { key: 'g', display: 'G', finger: 'left-index', row: 2, col: 5 },
  { key: 'h', display: 'H', finger: 'right-index', row: 2, col: 6 },
  { key: 'j', display: 'J', finger: 'right-index', row: 2, col: 7 },
  { key: 'k', display: 'K', finger: 'right-middle', row: 2, col: 8 },
  { key: 'l', display: 'L', finger: 'right-ring', row: 2, col: 9 },
  { key: ';', display: ';', finger: 'right-pinky', row: 2, col: 10 },
  { key: "'", display: "'", finger: 'right-pinky', row: 2, col: 11 },

  // Bottom row
  { key: 'z', display: 'Z', finger: 'left-pinky', row: 3, col: 2 },
  { key: 'x', display: 'X', finger: 'left-ring', row: 3, col: 3 },
  { key: 'c', display: 'C', finger: 'left-middle', row: 3, col: 4 },
  { key: 'v', display: 'V', finger: 'left-index', row: 3, col: 5 },
  { key: 'b', display: 'B', finger: 'left-index', row: 3, col: 6 },
  { key: 'n', display: 'N', finger: 'right-index', row: 3, col: 7 },
  { key: 'm', display: 'M', finger: 'right-index', row: 3, col: 8 },
  { key: ',', display: ',', finger: 'right-middle', row: 3, col: 9 },
  { key: '.', display: '.', finger: 'right-ring', row: 3, col: 10 },
  { key: '/', display: '/', finger: 'right-pinky', row: 3, col: 11 },

  // Space bar
  { key: ' ', display: 'Space', finger: 'thumb', row: 4, col: 6, width: 4 },
]

const getFingerColor = (finger: string) => {
  const colors: Record<string, string> = {
    'left-pinky': '#EF4444',
    'left-ring': '#F97316',
    'left-middle': '#EAB308',
    'left-index': '#22C55E',
    'left-thumb': '#6366F1',
    'right-thumb': '#6366F1',
    'right-index': '#22C55E',
    'right-middle': '#EAB308',
    'right-ring': '#F97316',
    'right-pinky': '#EF4444',
    'thumb': '#6366F1',
  }
  return colors[finger] || 'var(--fg-4)'
}

const KeyboardVisualization = ({ highlightedKeys, pressedKeys }: KeyboardVisualizationProps) => {
  const renderKey = (keyInfo: KeyInfo) => {
    const isHighlighted = highlightedKeys.includes(keyInfo.key)
    const isPressed = pressedKeys.includes(keyInfo.key)
    const baseWidth = 48
    const keyWidth = (keyInfo.width || 1) * baseWidth + (keyInfo.width ? (keyInfo.width - 1) * 4 : 0)

    return (
      <div
        key={keyInfo.key}
        className={`
          flex items-center justify-center rounded text-sm font-mono font-semibold transition-all duration-150
          ${isPressed ? 'transform scale-95' : ''}
          ${keyInfo.key === ' ' ? 'h-10' : 'h-12'}
        `}
        style={{
          width: `${keyWidth}px`,
          background: isHighlighted
            ? getFingerColor(keyInfo.finger)
            : isPressed
            ? 'var(--accent)'
            : 'var(--paper-2)',
          border: `2px solid ${
            isHighlighted
              ? getFingerColor(keyInfo.finger)
              : isPressed
              ? 'var(--accent)'
              : 'var(--rule)'
          }`,
          color: isHighlighted || isPressed ? 'white' : 'var(--fg-1)',
          boxShadow: isPressed ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {keyInfo.display}
      </div>
    )
  }

  const groupByRow = () => {
    const rows: KeyInfo[][] = [[], [], [], [], []]
    keyLayout.forEach(key => {
      rows[key.row].push(key)
    })
    return rows
  }

  return (
    <div className="p-6 rounded-lg" style={{ background: 'var(--paper)', border: `1px solid var(--rule)` }}>
      <div className="space-y-2">
        {groupByRow().map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {/* Special keys for each row */}
            {rowIndex === 0 && (
              <div className="flex items-center justify-center w-12 h-12 rounded text-sm font-mono font-semibold mr-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                ~
              </div>
            )}
            {rowIndex === 1 && (
              <div className="flex items-center justify-center w-16 h-12 rounded text-sm font-mono font-semibold mr-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                Tab
              </div>
            )}
            {rowIndex === 2 && (
              <div className="flex items-center justify-center w-20 h-12 rounded text-sm font-mono font-semibold mr-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                Caps
              </div>
            )}
            {rowIndex === 3 && (
              <div className="flex items-center justify-center w-24 h-12 rounded text-sm font-mono font-semibold mr-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                Shift
              </div>
            )}

            {/* Regular keys */}
            {row.map(renderKey)}

            {/* Right side special keys */}
            {rowIndex === 0 && (
              <div className="flex items-center justify-center w-20 h-12 rounded text-sm font-mono font-semibold ml-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                ⌫
              </div>
            )}
            {rowIndex === 1 && (
              <div className="flex items-center justify-center w-16 h-12 rounded text-sm font-mono font-semibold ml-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                \
              </div>
            )}
            {rowIndex === 2 && (
              <div className="flex items-center justify-center w-24 h-12 rounded text-sm font-mono font-semibold ml-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                Enter
              </div>
            )}
            {rowIndex === 3 && (
              <div className="flex items-center justify-center w-32 h-12 rounded text-sm font-mono font-semibold ml-1"
                   style={{ background: 'var(--paper-3)', border: `2px solid var(--rule-2)`, color: 'var(--fg-3)' }}>
                Shift
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Finger color legend */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-4 text-xs" style={{ color: 'var(--fg-3)' }}>
          {[
            { finger: 'left-pinky', label: 'L5' },
            { finger: 'left-ring', label: 'L4' },
            { finger: 'left-middle', label: 'L3' },
            { finger: 'left-index', label: 'L2' },
            { finger: 'thumb', label: 'L1/R1' },
            { finger: 'right-index', label: 'R2' },
            { finger: 'right-middle', label: 'R3' },
            { finger: 'right-ring', label: 'R4' },
            { finger: 'right-pinky', label: 'R5' },
          ].map(item => (
            <div key={item.finger} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: getFingerColor(item.finger) }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KeyboardVisualization