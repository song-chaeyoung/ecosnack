import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Bookmark, BookmarkCheck, FileX, Share2 } from 'lucide-react'
import { dailyReportsQueryOptions } from '@/lib/daily-reports.queries'
import { ShortsCard } from '@/components/feature/dailyReport/ShortsCard'
import { SITE_CONFIG, getPageMeta } from '../lib/seo'

export const Route = createFileRoute('/daily-report/shorts')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      dailyReportsQueryOptions({ limit: 10 }),
    )
  },
  head: () => ({
    meta: getPageMeta({
      title: `데일리 리포트 숏폼 | ${SITE_CONFIG.title}`,
      description: '풀스크린 스와이프로 보는 경제 데일리 리포트',
      path: '/daily-report/shorts',
    }),
  }),
  component: DailyShortsPage,
})

function DailyShortsPage() {
  const { data } = useSuspenseQuery(dailyReportsQueryOptions({ limit: 10 }))
  const reports = data?.reports ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set())
  const snapRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    snapRefs.current.forEach((el, index) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index)
            navigator.vibrate?.(10)
          }
        },
        { threshold: 0.6 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [reports.length])

  // 키보드 Page Up/Down 네비게이션
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(activeIndex + 1, reports.length - 1)
        snapRefs.current[next]?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = Math.max(activeIndex - 1, 0)
        snapRefs.current[prev]?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, reports.length])

  const handleShare = useCallback(async () => {
    const report = reports[activeIndex]
    if (!report) return
    const shareData = {
      title: report.executiveSummary.headline,
      text: report.executiveSummary.overview,
      url: `${window.location.origin}/daily-report/${report.reportDate}`,
    }
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(shareData.url)
    }
  }, [activeIndex, reports])

  function toggleBookmark(reportId: number) {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(reportId)) {
        next.delete(reportId)
      } else {
        next.add(reportId)
      }
      return next
    })
  }

  const activeReport = reports[activeIndex]
  const isActiveBookmarked = activeReport
    ? bookmarkedIds.has(activeReport.id)
    : false

  // 빈 상태 UI
  if (reports.length === 0) {
    return (
      <div className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <FileX className="w-12 h-12 text-white/30" />
        <p className="text-white/50 text-sm">아직 리포트가 없어요</p>
        <Link
          to="/"
          className="mt-2 text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black select-none">
      {/* Snap scroll container */}
      <div
        className="h-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {reports.map((report, index) => (
          <div
            key={report.id}
            ref={(el) => {
              snapRefs.current[index] = el
            }}
            className="h-full snap-start snap-always"
          >
            {/* 가상화: 현재 카드 ±1만 렌더 */}
            {Math.abs(index - activeIndex) <= 1 ? (
              <ShortsCard
                report={report}
                isActive={activeIndex === index}
                isBookmarked={bookmarkedIds.has(report.id)}
                onDoubleClick={() => toggleBookmark(report.id)}
              />
            ) : (
              <div className="h-full w-full bg-zinc-950" />
            )}
          </div>
        ))}
      </div>

      {/* Progress dots - right side */}
      {reports.length > 0 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
          {reports.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                snapRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`rounded-full bg-white transition-all duration-300 ${
                activeIndex === index ? 'w-2 h-6' : 'w-2 h-2 opacity-40'
              }`}
              aria-label={`${index + 1}번째 리포트로 이동`}
            />
          ))}
        </div>
      )}

      {/* Side action buttons - bottom right (safe-area 대응) */}
      <div
        className="absolute right-4 flex flex-col gap-3 z-50"
        style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          aria-label="공유"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => activeReport && toggleBookmark(activeReport.id)}
          className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
            isActiveBookmarked
              ? 'bg-amber-500/30 text-amber-400 hover:bg-amber-500/40'
              : 'bg-white/15 text-white hover:bg-white/25'
          }`}
          aria-label={isActiveBookmarked ? '북마크 해제' : '북마크'}
        >
          {isActiveBookmarked ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}
