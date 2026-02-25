import { useState, useRef, useEffect, useMemo } from 'react'
import { GLOSSARY } from '@/lib/glossary'

// 정규식 특수문자 이스케이프
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 용어를 길이 내림차순 정렬 (긴 단어 우선 매칭)
const SORTED_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length)

// 어절 시작에서만 매칭 (띄어쓰기/문장 시작 뒤)
const GLOSSARY_REGEX = new RegExp(
  `(?<=^|[\\s.,;:!?'"()\\[\\]{}])(${SORTED_TERMS.map(escapeRegex).join('|')})`,
  'g',
)

interface GlossaryTextProps {
  text: string
  className?: string
}

export function GlossaryText({ text, className }: GlossaryTextProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const popoverRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  // 첫 등장만 하이라이트
  const parts = useMemo(() => {
    const matches = Array.from(text.matchAll(GLOSSARY_REGEX))
    const seen = new Set<string>()
    const highlights: Array<{ pos: number; term: string }> = []

    // 각 용어의 첫 등장만 수집
    for (const match of matches) {
      const term = match[1]
      if (!seen.has(term)) {
        seen.add(term)
        highlights.push({ pos: match.index!, term })
      }
    }

    // 텍스트 분할
    const result: Array<{ isTerm: boolean; text: string }> = []
    let lastPos = 0

    for (const { pos, term } of highlights) {
      if (pos > lastPos) {
        result.push({ isTerm: false, text: text.slice(lastPos, pos) })
      }
      result.push({ isTerm: true, text: term })
      lastPos = pos + term.length
    }

    if (lastPos < text.length) {
      result.push({ isTerm: false, text: text.slice(lastPos) })
    }

    return result
  }, [text])

  const handleTermClick = (
    term: string,
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (containerRect) {
      setPopoverPosition({
        top: rect.bottom - containerRect.top + 8,
        left: rect.left - containerRect.left,
      })
    }

    setActiveTerm(activeTerm === term ? null : term)
  }

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setActiveTerm(null)
      }
    }

    if (activeTerm) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeTerm])

  return (
    <span ref={containerRef} className={`relative ${className ?? ''}`}>
      {parts.map((part, i) => {
        if (part.isTerm) {
          return (
            <span
              key={i}
              onClick={(e) => handleTermClick(part.text, e)}
              className="font-medium underline underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors"
            >
              {part.text}
            </span>
          )
        }
        return <span key={i}>{part.text}</span>
      })}

      {/* Popover */}
      {activeTerm && (
        <span
          ref={popoverRef}
          className="absolute z-50 w-64 p-3 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border animate-in fade-in-0 zoom-in-95 block"
          style={{
            top: popoverPosition.top,
            left: popoverPosition.left,
          }}
        >
          <span className="font-semibold text-sm mb-1 block">{activeTerm}</span>
          <span className="text-xs text-muted-foreground leading-relaxed block">
            {GLOSSARY[activeTerm]}
          </span>
        </span>
      )}
    </span>
  )
}
