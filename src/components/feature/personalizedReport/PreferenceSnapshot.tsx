import type { PreferenceSnapshot as PreferenceSnapshotType } from '@/db/schema'
import { CATEGORY_INFO } from '@/lib/const'

interface PreferenceSnapshotProps {
  snapshot: PreferenceSnapshotType
}

const sentimentLabels: Record<string, string> = {
  positive: '긍정적',
  negative: '부정적',
  neutral: '중립적',
  mixed: '혼합',
}

export function PreferenceSnapshot({ snapshot }: PreferenceSnapshotProps) {
  return (
    <div className="mb-8 p-5 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl border border-violet-100/50 dark:border-violet-900/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-400 w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0">
          🎯
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            나의 관심 기반 분석
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            이 리포트는 아래 선호도를 기반으로 생성되었습니다
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* 관심 카테고리 */}
        {snapshot.topCategories.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-1.5">
              관심 카테고리
            </span>
            <div className="flex flex-wrap gap-1.5">
              {snapshot.topCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-md text-xs font-medium"
                >
                  {CATEGORY_INFO[cat.category as keyof typeof CATEGORY_INFO]?.name ?? cat.category}
                  <span className="text-violet-400 dark:text-violet-500">
                    ({Math.round(cat.weight * 100)}%)
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 관심 키워드 */}
        {snapshot.topKeywords.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-1.5">
              관심 키워드
            </span>
            <div className="flex flex-wrap gap-1.5">
              {snapshot.topKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-medium"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 감성 편향 */}
        {snapshot.sentimentBias && (
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-1.5">
              관심 감성
            </span>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium">
              {sentimentLabels[snapshot.sentimentBias] ?? snapshot.sentimentBias}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
