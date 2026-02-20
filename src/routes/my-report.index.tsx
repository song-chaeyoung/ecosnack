import { Suspense } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { Card } from '@/components/ui/card'
import { LoginRequired } from '@/components/LoginRequired'
import { personalizedReportsInfiniteQueryOptions } from '@/lib/personalized-reports.queries'
import { getPageMeta } from '@/lib/seo'
import { getAuthStatus } from '@/lib/auth.middleware'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export const Route = createFileRoute('/my-report/')({
  beforeLoad: async () => {
    const { isAuthenticated } = await getAuthStatus()
    return { isAuthenticated }
  },
  head: () => ({
    meta: getPageMeta({
      title: '나의 맞춤 리포트',
      description:
        '나의 관심 분야에 맞춰 분석된 개인화 경제 리포트 목록입니다.',
      path: '/my-report',
    }),
  }),
  loader: async ({ context }) => {
    const { isAuthenticated } = await getAuthStatus()
    if (isAuthenticated) {
      await context.queryClient.prefetchInfiniteQuery(
        personalizedReportsInfiniteQueryOptions,
      )
    }
  },
  component: MyReportListPage,
})

function MyReportListPage() {
  const { isAuthenticated: ssrIsAuthenticated } = Route.useRouteContext()
  const { isSignedIn } = useAuth()

  const isAuthenticated =
    typeof window === 'undefined' ? ssrIsAuthenticated : isSignedIn

  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen">
        <LoginRequired
          title="맞춤 리포트를 확인하려면 로그인하세요"
          description="나의 관심사에 맞춘 개인화 경제 리포트를&#10;로그인하고 확인하세요!"
          icon="🎯"
          buttonText="로그인하고 맞춤 리포트 보기"
        />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<MyReportListSkeleton />}>
        <MyReportListContent />
      </Suspense>
    </div>
  )
}

function MyReportListSkeleton() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="mb-8">
          <div className="h-6 bg-muted rounded w-24 mb-3 animate-pulse" />
          <div className="h-10 bg-muted rounded w-48 mb-2 animate-pulse" />
          <div className="h-5 bg-muted rounded w-64 animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="p-5 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-2/3 mb-3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

function MyReportListContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(personalizedReportsInfiniteQueryOptions)

  const reports = data.pages.flatMap((page) => page.reports)

  const observerRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage ?? false,
    isFetchingNextPage,
  )

  if (reports.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-4xl">📭</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            아직 맞춤 리포트가 없습니다
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            관심사를 설정하면 매일 맞춤 리포트가 생성됩니다.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-md text-xs font-bold">
              🎯 맞춤 리포트
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            나의 맞춤 리포트
          </h1>
          <p className="text-muted-foreground">
            나의 관심사에 맞춰 생성된 개인화 리포트 목록입니다.
          </p>
        </div>

        {/* Report List */}
        <div className="space-y-4 flex flex-col gap-2">
          {reports.map((report) => (
            <Link
              key={report.id}
              to="/my-report/$date"
              params={{ date: report.reportDate }}
            >
              <Card className="p-5 hover:shadow-lg transition-all cursor-pointer hover:border-violet-300 dark:hover:border-violet-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-foreground">
                        {new Date(report.reportDate).toLocaleDateString(
                          'ko-KR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long',
                          },
                        )}
                      </span>
                      <SentimentBadgeSmall
                        sentiment={report.executiveSummary.sentiment.overall}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {report.executiveSummary.headline}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        📰 기사 {report.articleCount}개
                      </span>
                      <span className="flex items-center gap-1">
                        💡 인사이트 {report.keyInsights.length}개
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {/* Loading Skeleton */}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`loading-${index}`} className="p-5 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </Card>
            ))}
        </div>

        {/* Intersection Observer Trigger */}
        {hasNextPage && <div ref={observerRef} className="h-10" />}
      </div>
    </main>
  )
}

function SentimentBadgeSmall({
  sentiment,
}: {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
}) {
  const config = {
    positive: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      label: '긍정',
    },
    negative: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      label: '부정',
    },
    neutral: {
      bg: 'bg-slate-100 dark:bg-slate-800/30',
      text: 'text-slate-600 dark:text-slate-400',
      label: '중립',
    },
    mixed: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      label: '혼합',
    },
  }

  const { bg, text, label } = config[sentiment]

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  )
}
