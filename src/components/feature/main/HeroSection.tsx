import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* 배경 패턴/장식 - 은은하게 */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-200 dark:bg-slate-700/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-20 sm:pb-32">
        <div className="text-center">
          {/* 메인 슬로건 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-snug">
            오늘의 경제, 한 입에
          </h1>

          {/* 서브 카피 */}
          <p className="text-lg sm:text-xl text-muted-foreground font-normal max-w-2xl mx-auto mb-8 sm:mb-12 break-keep leading-relaxed">
            복잡한 경제 뉴스를 AI가 쉽게 분석해드려요.
            <br />
            매일 글로벌 시장 동향부터 나에게 미치는 영향까지.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-8 py-3 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              >
                뉴스 보러가기
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 border hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-3 h-12 text-base font-normal"
              >
                데일리 리포트 보기
              </Button>
            </Link>
          </div>
        </div>

        {/* 떠있는 카드 미리보기 */}
        <div className="mt-12 sm:mt-20 flex justify-center">
          <div className="relative w-full max-w-4xl">
            {/* 메인 카드 */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 mx-4 sm:mx-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">오늘의 요약</p>
                  <p className="font-medium font-display text-foreground">
                    Daily Economic Report
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-5/6" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-4/6" />
              </div>
            </div>

            {/* 왼쪽 플로팅 카드 */}
            <div className="absolute left-2 sm:left-0 -bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2 bg-white dark:bg-card rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 p-3 sm:p-4 w-32 sm:w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">AI 요약</span>
              </div>
              <p className="text-sm font-normal text-foreground">
                핵심만 빠르게
              </p>
            </div>

            {/* 오른쪽 플로팅 카드 */}
            <div className="absolute right-2 sm:right-0 -bottom-6 sm:bottom-auto sm:top-1/3 sm:translate-x-1/2 bg-white dark:bg-card rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 p-3 sm:p-4 w-32 sm:w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-xs text-muted-foreground break-keep">
                  매일 업데이트
                </div>
              </div>
              <p className="text-sm font-normal text-foreground">글로벌 뉴스</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
