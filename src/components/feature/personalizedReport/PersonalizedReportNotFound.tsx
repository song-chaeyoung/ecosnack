import { Link } from '@tanstack/react-router'

export default function PersonalizedReportNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🎯</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        맞춤 리포트를 찾을 수 없습니다
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        요청하신 날짜의 맞춤 리포트가 존재하지 않습니다.
        <br />
        다른 날짜의 리포트를 찾아보시는 건 어떨까요?
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => history.back()}
          className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors cursor-pointer"
        >
          이전 페이지로
        </button>
        <Link
          to="/my-report"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          리포트 목록으로
        </Link>
      </div>
    </div>
  )
}
