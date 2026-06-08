'use client'

import { useEffect, useRef } from 'react'
import { useTyping } from '@/hooks/useTyping'

export type TypingEditorProps = {
  code: string
  language: string
  onComplete: (cpm: number, accuracy: number, timeElapsed: number, errors: number, totalKeys: number) => void
  className?: string
}

export const TypingEditor = ({ code, onComplete, className }: TypingEditorProps) => {
  const { state, handleKeyPress, reset, getCharacterState } = useTyping(code)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.isComplete && state.startTime) {
      const timeElapsed = (Date.now() - state.startTime) / 1000
      const totalKeys = state.input.length + state.errors
      onComplete(state.cpm, state.accuracy, timeElapsed, state.errors, totalKeys)
    }
  }, [state.isComplete, state.startTime, state.cpm, state.accuracy, state.errors, state.input.length, onComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent all default browser shortcuts
      e.preventDefault()

      // Block autocomplete, paste, cut, copy, select all
      if (e.ctrlKey || e.metaKey) {
        return
      }

      // Block arrow keys, home, end, page up/down
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
        return
      }

      // ESC to reset
      if (e.key === 'Escape') {
        reset()
        if (editorRef.current) {
          editorRef.current.focus()
        }
        return
      }

      handleKeyPress(e.key)
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const handleSelectStart = (e: Event) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [handleKeyPress, reset])

  useEffect(() => {
    // Focus the editor when component mounts
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  const renderCharacter = (char: string, index: number) => {
    const charState = getCharacterState(index)

    let className = 'relative'

    switch (charState) {
      case 'correct':
        className += ' text-[var(--fg-1)]'
        break
      case 'incorrect':
        className += ' text-[var(--err)] bg-[var(--err)]/20'
        break
      case 'current':
        className += ' text-[var(--fg-1)] bg-[var(--accent)]/30'
        break
      case 'pending':
        className += ' text-[var(--fg-4)]'
        break
    }

    // Handle special characters
    if (char === '\n') {
      return (
        <span key={index} className={className}>
          {charState === 'current' && (
            <span className="absolute top-0 left-0 w-0.5 h-full bg-[var(--accent)] animate-pulse" />
          )}
          <br />
        </span>
      )
    }

    if (char === ' ') {
      return (
        <span key={index} className={`${className} inline-block w-[0.5ch] relative`}>
          {charState === 'current' && (
            <span className="absolute top-0 left-0 w-0.5 h-full bg-[var(--accent)] animate-pulse" />
          )}
          {charState === 'pending' && <span className="text-[var(--fg-5)]">·</span>}
        </span>
      )
    }

    if (char === '\t') {
      return (
        <span key={index} className={`${className} inline-block w-[2ch] relative`}>
          {charState === 'current' && (
            <span className="absolute top-0 left-0 w-0.5 h-full bg-[var(--accent)] animate-pulse" />
          )}
          {charState === 'pending' && <span className="text-[var(--fg-5)]">→</span>}
        </span>
      )
    }

    return (
      <span key={index} className={`${className} relative`}>
        {charState === 'current' && (
          <span className="absolute top-0 left-0 w-0.5 h-full bg-[var(--accent)] animate-pulse" />
        )}
        {char}
      </span>
    )
  }

  const renderSyntaxHighlighting = (text: string) => {
    const lines = text.split('\n')

    return lines.map((line, lineIndex) => (
      <div key={lineIndex} className="min-h-[1.5rem]">
        {line.split('').map((char, charIndex) => {
          const globalIndex = lines.slice(0, lineIndex).join('\n').length +
                            (lineIndex > 0 ? 1 : 0) + charIndex
          return renderCharacter(char, globalIndex)
        })}
        {lineIndex < lines.length - 1 &&
          renderCharacter('\n', lines.slice(0, lineIndex + 1).join('\n').length - 1)
        }
      </div>
    ))
  }

  return (
    <div className={`relative ${className || ''}`}>
      {/* Metrics Display */}
      <div className="flex gap-6 mb-4 text-sm font-[var(--font-mono)] text-[var(--fg-3)]">
        <div className="flex gap-2">
          <span>CPM:</span>
          <span className="text-[var(--accent)] font-medium">{state.cpm}</span>
        </div>
        <div className="flex gap-2">
          <span>정확도:</span>
          <span className="text-[var(--accent)] font-medium">{state.accuracy}%</span>
        </div>
        <div className="flex gap-2">
          <span>진행률:</span>
          <span className="text-[var(--accent)] font-medium">
            {Math.round((state.currentIndex / code.length) * 100)}%
          </span>
        </div>
        <div className="flex gap-2">
          <span>오타:</span>
          <span className="text-[var(--err)] font-medium">{state.errors}</span>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-6 font-[var(--font-mono)] text-base leading-relaxed focus:outline-none focus:border-[var(--accent)] transition-colors cursor-text min-h-[400px] overflow-auto"
        tabIndex={0}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <div className="whitespace-pre-wrap">
          {renderSyntaxHighlighting(code)}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs font-[var(--font-mono)] text-[var(--fg-4)] flex gap-6 flex-wrap">
        <span>• 자동완성·붙여넣기 비활성화</span>
        <span>• 오타는 백스페이스로만 수정</span>
        <span>• ESC키로 다시 시작</span>
      </div>

      {/* Reset on ESC */}
      <div className="hidden">
        <button
          onClick={() => {
            reset()
            if (editorRef.current) {
              editorRef.current.focus()
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              reset()
            }
          }}
        />
      </div>
    </div>
  )
}
