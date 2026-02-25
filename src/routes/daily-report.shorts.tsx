import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Bookmark, Share2, X } from 'lucide-react'
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
  const snapRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    snapRefs.current.forEach((el, index) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index)
        },
        { threshold: 0.6 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [reports.length])

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

  return (
    <div className="fixed inset-0 z-[60] bg-black select-none">
      {/* Close button - top left */}
      {/* <Link
        to="/"
        className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        aria-label="닫기"
      >
        <X className="w-5 h-5" />
      </Link> */}

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
            <ShortsCard report={report} isActive={activeIndex === index} />
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

      {/* Side action buttons - bottom right */}
      <div className="absolute right-4 bottom-8 flex flex-col gap-3 z-50">
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          aria-label="공유"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          aria-label="북마크"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
