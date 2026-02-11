import { useState, useRef, useEffect, useMemo } from 'react'
import { GLOSSARY } from '@/lib/glossary'

// 컴포넌트 외부에서 한 번만 생성
const TERMS = Object.keys(GLOSSARY)
const TERMS_SET = new Set(TERMS)
const GLOSSARY_REGEX = new RegExp(`(${TERMS.join('|')})`, 'g')

interface GlossaryTextProps {
  text: string
  className?: string
}

export function GlossaryText({ text, className }: GlossaryTextProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const popoverRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  // text가 바뀔 때만 재계산
  // const parts = useMemo(() => text.split(GLOSSARY_REGEX), [text])
  const parts = useMemo(() => {
    const seen = new Set<string>()
    // matchAll로 매칭 위치를 찾고, 이미 본 용어는 스킵
    // → 첫 번째만 하이라이트 대상으로 남김
    return text.split(GLOSSARY_REGEX).map((part) => {
      if (TERMS_SET.has(part) && !seen.has(part)) {
        seen.add(part)
        return part
      }
      return part
    })
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
      {parts.map((part, index) => {
        if (TERMS_SET.has(part)) {
          return (
            <span
              key={index}
              onClick={(e) => handleTermClick(part, e)}
              className="text-primary underline underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors"
            >
              {part}
            </span>
          )
        }
        return <span key={index}>{part}</span>
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
