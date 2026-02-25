import { useState, useMemo } from 'react'
import { EconomicTerms, ECONOMIC_TERMS_REGEX } from '@/constants/economic-terms'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface EconomicTermsTextProps {
  text: string
  className?: string
}

export function EconomicTermsText({ text, className }: EconomicTermsTextProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null)

  // 첫 등장만 하이라이트
  const parts = useMemo(() => {
    const matches = Array.from(text.matchAll(ECONOMIC_TERMS_REGEX))
    const seen = new Set<string>()
    const highlights: Array<{ pos: number; term: string }> = []

    for (const match of matches) {
      const term = match[1]
      if (!seen.has(term)) {
        seen.add(term)
        highlights.push({ pos: match.index!, term })
      }
    }

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

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.isTerm) {
          return (
            <Popover
              key={i}
              open={activeTerm === part.text}
              onOpenChange={(open) => setActiveTerm(open ? part.text : null)}
            >
              <PopoverTrigger
                render={<span />}
                className="font-medium underline underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors"
              >
                {part.text}
              </PopoverTrigger>
              {activeTerm === part.text && (
                <PopoverContent
                  side="bottom"
                  align="start"
                  className="w-64 p-3 gap-1"
                >
                  <span className="font-semibold text-sm block">
                    {part.text}
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed block">
                    {EconomicTerms[part.text as keyof typeof EconomicTerms]}
                  </span>
                </PopoverContent>
              )}
            </Popover>
          )
        }
        return <span key={i}>{part.text}</span>
      })}
    </span>
  )
}
