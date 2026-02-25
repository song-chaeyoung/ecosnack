import { Link } from '@tanstack/react-router'
import { ChevronRight, X } from 'lucide-react'
import { SentimentBadge } from './SentimentBadge'
import type { DailyReport } from '@/db/schema/daily-reports'

interface ShortsCardProps {
  report: DailyReport
  isActive: boolean
}

function sentimentGlow(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return 'bg-emerald-500'
    case 'negative':
      return 'bg-red-500'
    case 'mixed':
      return 'bg-amber-500'
    default:
      return 'bg-blue-500'
  }
}

function sentimentTextGradient(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return 'bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent'
    case 'negative':
      return 'bg-gradient-to-r from-red-300 to-rose-200 bg-clip-text text-transparent'
    case 'mixed':
      return 'bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent'
    default:
      return 'bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent'
  }
}

function sentimentAccent(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return 'text-emerald-400'
    case 'negative':
      return 'text-red-400'
    case 'mixed':
      return 'text-amber-400'
    default:
      return 'text-blue-400'
  }
}

export function ShortsCard({ report, isActive }: ShortsCardProps) {
  const sentiment = report.executiveSummary.sentiment.overall
  const firstInsight = report.keyInsights[0]

  return (
    <div
      className={`h-full w-full bg-zinc-950 flex flex-col transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-50'} overflow-hidden relative`}
    >
      {/* Sentiment glow - top center */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-72 ${sentimentGlow(sentiment)} opacity-30 blur-3xl pointer-events-none`}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <Link
          to="/"
          className="w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </Link>
        <span className="text-xs font-medium text-white/40">
          {new Date(report.reportDate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <SentimentBadge
          sentiment={sentiment}
          description={report.executiveSummary.sentiment.description}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-2 pb-8 space-y-4 overflow-hidden">
        {/* Headline */}
        <h2
          className={`text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-white`}
        >
          {report.executiveSummary.headline}
        </h2>

        {/* Spacer */}
        <div className="flex-1" />
        {/* Overview */}
        <p className="text-sm text-white/85 line-clamp-4 leading-relaxed">
          {report.executiveSummary.overview}
        </p>

        {/* Impact */}
        {firstInsight && (
          <div className="bg-white/5 rounded-xl px-4 py-3 space-y-1">
            <p
              className={`text-xs font-bold uppercase tracking-widest ${sentimentAccent(sentiment)}`}
            >
              나에게 미치는 영향
            </p>
            <p className="text-sm text-white/90 line-clamp-3 leading-relaxed">
              {firstInsight.implications.consumers}
            </p>
          </div>
        )}

        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          {report.topKeywords.slice(0, 4).map((keyword, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-full bg-white/8 text-white/70 font-medium border border-white/10"
            >
              #{keyword}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-xs text-white/35">
            📰 {report.articleCount}개 기사 분석
          </span>
          <Link
            to="/daily-report/$date"
            params={{ date: report.reportDate }}
            className="flex items-center gap-1 text-xs text-white/55 hover:text-white transition-colors"
          >
            전체 보기
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
