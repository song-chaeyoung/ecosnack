import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { Card } from '@/components/ui/card'
import { SentimentBadge } from '@/components/feature/dailyReport/SentimentBadge'
import { ExecutiveSummary } from '@/components/feature/dailyReport/ExecutiveSummary'
import { KeyInsightCard } from '@/components/feature/dailyReport/KeyInsightCard'
import { ShareButtons } from '@/components/feature/article/ShareButtons'
import { PreferenceSnapshot } from '@/components/feature/personalizedReport/PreferenceSnapshot'
import { LoginRequired } from '@/components/LoginRequired'
import { personalizedReportWithArticlesQueryOptions } from '@/lib/personalized-reports.queries'
import { getPageMeta } from '@/lib/seo'
import { getAuthStatus } from '@/lib/auth.middleware'
import { useEffect } from 'react'

export const Route = createFileRoute('/my-report/$date')({
  beforeLoad: async () => {
    const { isAuthenticated } = await getAuthStatus()
    return { isAuthenticated }
  },
  head: ({ params }) => ({
    meta: getPageMeta({
      title: `${params.date} 나의 맞춤 리포트`,
      description:
        '나의 관심 분야에 맞춰 분석된 개인화 경제 리포트입니다.',
      path: `/my-report/${params.date}`,
    }),
  }),
  component: PersonalizedReportPage,
})

function PersonalizedReportPage() {
  const { date } = Route.useParams()
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
    <div className="bg-background min-h-screen flex flex-col">
      <PersonalizedReportContent date={date} />
    </div>
  )
}

function PersonalizedReportContent({ date }: { date: string }) {
  const { data, isLoading } = useQuery(
    personalizedReportWithArticlesQueryOptions(date),
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-40 bg-muted rounded" />
          <div className="h-60 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-4xl">📭</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            맞춤 리포트가 없습니다
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {date} 날짜의 개인화 리포트가 아직 생성되지 않았습니다.
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

  const { report, articles } = data

  // 날짜 네비게이션 계산
  const currentDate = new Date(report.reportDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getPreviousDate = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 1)
    return prev.toISOString().split('T')[0]
  }

  const getNextDate = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 1)
    return next.toISOString().split('T')[0]
  }

  const isLatestReport = currentDate >= today

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-md text-xs font-bold">
            🎯 맞춤 리포트
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {new Date(report.reportDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </h1>
          <SentimentBadge
            sentiment={report.executiveSummary.sentiment.overall}
            description={report.executiveSummary.sentiment.description}
          />
        </div>

        {/* Compact Sentiment Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">
              감성 분석
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md text-xs font-medium border border-emerald-200/50 dark:border-emerald-700/50">
              <span className="font-bold">
                {report.sentimentAnalysis.positiveCount}
              </span>
              긍정
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200/50 dark:border-slate-700/50">
              <span className="font-bold">
                {report.sentimentAnalysis.neutralCount}
              </span>
              중립
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-xs font-medium border border-red-200/50 dark:border-red-700/50">
              <span className="font-bold">
                {report.sentimentAnalysis.negativeCount}
              </span>
              부정
            </span>
          </div>
          <ShareButtons />
        </div>
      </div>

      {/* Preference Snapshot */}
      {report.preferenceSnapshot && (
        <PreferenceSnapshot snapshot={report.preferenceSnapshot} />
      )}

      {/* Executive Summary */}
      <ExecutiveSummary executiveSummary={report.executiveSummary} />

      {/* Market Overview */}
      <div className="mb-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-zinc-950/40 rounded-2xl shadow-sm border border-slate-100/50 dark:border-slate-900/30 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
              📊
            </div>
            <h2 className="text-2xl font-bold text-foreground pt-1.5">
              시장 개요
            </h2>
          </div>
          <p className="text-muted-foreground text-responsive-base mb-6 leading-relaxed">
            {report.marketOverview.summary}
          </p>

          {/* Sections */}
          <div className="space-y-6">
            {report.marketOverview.sections.map((section, idx) => (
              <div key={idx} className="border-t border-border pt-4">
                <h3 className="text-responsive-lg font-semibold text-foreground mb-3">
                  {section.title}
                </h3>
                <p className="text-muted-foreground text-responsive-base mb-3">
                  {section.content}
                </p>

                {section.keyData.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-responsive-sm font-semibold text-foreground mb-2">
                      주요 데이터
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-responsive-sm text-muted-foreground">
                      {section.keyData.map((data, dataIdx) => (
                        <li key={dataIdx}>{data}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Outlook */}
          <div className="mt-6 p-4 bg-card/50 rounded-lg">
            <h3 className="text-responsive-sm font-semibold text-foreground mb-2">
              📊 시장 전망
            </h3>
            <p className="text-muted-foreground text-responsive-sm">
              {report.marketOverview.outlook}
            </p>
          </div>

          {/* Watch List */}
          {report.marketOverview.watchList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-responsive-sm font-semibold text-foreground mb-2">
                👀 주시할 항목
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.marketOverview.watchList.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-card text-card-foreground rounded-lg text-responsive-sm font-medium border transition-all hover:scale-105"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">핵심 인사이트</h2>
        {report.keyInsights.map((insight, idx) => (
          <KeyInsightCard key={idx} insight={insight} />
        ))}
      </div>

      {/* Keywords */}
      <div className="mb-8">
        <h2 className="text-responsive-lg font-bold text-foreground mb-4">
          주요 키워드
        </h2>
        <div className="flex flex-wrap gap-2">
          {report.topKeywords.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 cursor-pointer text-responsive-sm font-medium"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      {articles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-responsive-lg font-bold text-foreground mb-4">
            관련 기사 ({report.articleCount}개)
          </h2>
          <div className="grid gap-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                to="/article/$id"
                params={{ id: String(article.id) }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-responsive-sm text-muted-foreground line-clamp-2 mb-2">
                        {article.headlineSummary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>
                          {article.pubDate &&
                            new Date(article.pubDate).toLocaleDateString(
                              'ko-KR',
                            )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Date Navigation */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/my-report/$date"
            params={{ date: getPreviousDate() }}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <span className="text-xl">&larr;</span>
            <span className="text-sm font-medium">이전 리포트</span>
          </Link>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {new Date(report.reportDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {isLatestReport ? (
            <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground/40 cursor-not-allowed">
              <span className="text-sm font-medium">다음 리포트</span>
              <span className="text-xl">&rarr;</span>
            </div>
          ) : (
            <Link
              to="/my-report/$date"
              params={{ date: getNextDate() }}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">다음 리포트</span>
              <span className="text-xl">&rarr;</span>
            </Link>
          )}
        </div>
      </Card>
    </article>
  )
}
