import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { NewsCard } from '../components/NewsCard'
import { latestArticlesQueryOptions } from '../lib/articles.queries'
import {
  SITE_CONFIG,
  getOrganizationJsonLd,
  getPageMeta,
  getWebsiteJsonLd,
} from '../lib/seo'
import { DailyReports } from '@/components/feature/main/DailyReports'
import { HeroSection } from '@/components/feature/main/HeroSection'
import { ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => {
    return {
      meta: getPageMeta({
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        path: '/',
        keywords: ['경제', '금융', '비즈니스', '시장', '정책', '무역'],
      }),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(getWebsiteJsonLd()),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(getOrganizationJsonLd()),
        },
      ],
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(latestArticlesQueryOptions(9))
  },
})

function HomePage() {
  const { data: articles } = useSuspenseQuery(latestArticlesQueryOptions(9))

  return (
    <main className="flex-1">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <DailyReports />

        {/* 최신 뉴스 섹션 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              to="/news"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              전체 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
