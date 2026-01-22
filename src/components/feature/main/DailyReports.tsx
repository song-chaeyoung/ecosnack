import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Card } from '@/components/ui/card'
import { DailyReportSkeleton } from './DailyReportSkeleton'

// ============================================
// Type Definitions
// ============================================
interface RelatedArticle {
  id: number
  title: string
  url: string // heyvoan.com/article/{id}
  importance: number // 1-10
}

interface ExecutiveSummary {
  headline: string // 한줄 헤드라인 (50자 이내)
  overview: string // 종합 요약 (800자 이상, 오늘 경제 뉴스의 핵심)

  highlights: {
    // 오늘의 하이라이트 3-5개
    title: string
    description: string // 150자 이상
    relatedArticle: RelatedArticle
  }[]

  sentiment: {
    overall: 'positive' | 'negative' | 'neutral' | 'mixed'
    description: string // 시장 분위기 설명 (100자 이상)
  }
}

// 카드 표시용 타입
interface DailyReportCard {
  id: string
  reportDate: string
  executiveSummary: ExecutiveSummary
  articleCount: number
  topKeywords: string[]
}

// ============================================
// Mock Data
// ============================================
const MOCK_REPORTS: DailyReportCard[] = [
  {
    id: '1',
    reportDate: '2026-01-21',
    executiveSummary: {
      headline: '글로벌 기업들의 탄소중립 선언 가속화',
      overview:
        '주요 글로벌 기업들이 2030년까지 탄소중립을 달성하겠다는 목표를 잇따라 발표하고 있습니다. 애플, 마이크로소프트, 구글 등이 선두주자로 나서며 업계 전반에 변화의 바람이 불고 있습니다. 이는 투자자들의 ESG 투자 확대와 소비자들의 환경 의식 증가에 따른 것으로 분석되며, 재생에너지 전환과 공급망 탄소 감축이 핵심 전략으로 부상하고 있습니다.',
      highlights: [
        {
          title: '애플, 2030 탄소중립 로드맵 발표',
          description:
            '애플이 공급망 전체를 포함한 탄소중립 계획을 상세히 공개했습니다. 재생에너지 100% 전환과 재활용 소재 확대가 핵심이며, 협력업체들도 동참을 약속했습니다.',
          relatedArticle: {
            id: 101,
            title: '애플 탄소중립 선언',
            url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
            importance: 9,
          },
        },
        {
          title: 'MS, AI 데이터센터 그린화 추진',
          description:
            '마이크로소프트가 AI 학습에 사용되는 데이터센터의 에너지 효율을 50% 개선하겠다고 밝혔습니다. 재생에너지 활용과 냉각 시스템 혁신이 주요 방안입니다.',
          relatedArticle: {
            id: 102,
            title: 'MS 그린 데이터센터',
            url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
            importance: 8,
          },
        },
      ],
      sentiment: {
        overall: 'positive',
        description:
          '글로벌 기업들의 적극적인 탄소중립 선언으로 시장은 긍정적 분위기입니다. ESG 투자 확대와 친환경 기술 개발이 가속화될 전망입니다.',
      },
    },
    articleCount: 12,
    topKeywords: ['탄소중립', '재생에너지', 'ESG'],
  },
  {
    id: '2',
    reportDate: '2026-01-20',
    executiveSummary: {
      headline: '식품업계 플라스틱 제로 도전',
      overview:
        '대형 식품 기업들이 2025년까지 플라스틱 포장재를 100% 친환경 소재로 전환한다고 밝혔습니다. 이는 소비자들의 환경 의식 증가에 따른 것으로 분석되며, 생분해성 소재와 재활용 가능 패키징이 주목받고 있습니다.',
      highlights: [
        {
          title: '네슬레, 바이오 플라스틱 전환 완료',
          description:
            '네슬레가 전 제품군의 포장재를 바이오 플라스틱으로 전환했습니다. 옥수수 전분 기반 소재를 사용하며 6개월 내 자연 분해가 가능합니다.',
          relatedArticle: {
            id: 201,
            title: '네슬레 친환경 패키징',
            url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
            importance: 8,
          },
        },
      ],
      sentiment: {
        overall: 'positive',
        description:
          '식품업계의 친환경 전환이 본격화되며 소비자 반응도 긍정적입니다. 다만 비용 증가에 따른 가격 인상 우려도 제기되고 있습니다.',
      },
    },
    articleCount: 8,
    topKeywords: ['친환경 패키징', '플라스틱 제로', '생분해성'],
  },
  {
    id: '3',
    reportDate: '2026-01-19',
    executiveSummary: {
      headline: 'ESG 펀드 유입 역대 최고치 경신',
      overview:
        '기관투자자들의 ESG 펀드 투자가 전년 대비 150% 증가하며 새로운 기록을 세웠습니다. 지속가능한 투자에 대한 관심이 그 어느 때보다 높아지고 있으며, 특히 탄소중립 관련 기업들에 대한 투자가 급증하고 있습니다.',
      highlights: [
        {
          title: '블랙록, ESG 펀드 10조원 돌파',
          description:
            '세계 최대 자산운용사 블랙록의 ESG 펀드 운용자산이 10조원을 넘어섰습니다. 재생에너지와 전기차 섹터에 집중 투자하고 있습니다.',
          relatedArticle: {
            id: 301,
            title: '블랙록 ESG 투자 확대',
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            importance: 9,
          },
        },
      ],
      sentiment: {
        overall: 'positive',
        description:
          'ESG 투자 열풍이 지속되며 관련 기업들의 주가가 상승세를 보이고 있습니다. 장기적 성장 가능성에 대한 기대감이 높습니다.',
      },
    },
    articleCount: 15,
    topKeywords: ['ESG 투자', '지속가능 금융', '그린본드'],
  },
  {
    id: '4',
    reportDate: '2026-01-18',
    executiveSummary: {
      headline: '재생에너지 투자 급증, 화석연료 대체 가속',
      overview:
        '태양광과 풍력 발전 설비에 대한 투자가 전년 대비 40% 증가했습니다. 각국 정부의 지원 정책과 기술 발전이 투자 확대를 이끌고 있으며, 발전 단가도 지속적으로 하락하고 있습니다.',
      highlights: [
        {
          title: '유럽, 해상풍력 프로젝트 대규모 착공',
          description:
            '유럽 연합이 북해 일대에 총 50GW 규모의 해상풍력 단지 건설을 시작했습니다. 2030년까지 완공 예정이며 1천만 가구에 전력을 공급할 계획입니다.',
          relatedArticle: {
            id: 401,
            title: '유럽 해상풍력 프로젝트',
            url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
            importance: 8,
          },
        },
      ],
      sentiment: {
        overall: 'positive',
        description:
          '재생에너지 투자 확대로 에너지 전환이 가속화되고 있습니다. 다만 송전망 구축과 에너지 저장 기술 개발이 과제로 남아있습니다.',
      },
    },
    articleCount: 10,
    topKeywords: ['태양광', '풍력', '재생에너지'],
  },
  {
    id: '5',
    reportDate: '2026-01-17',
    executiveSummary: {
      headline: '순환경제 모델 확산, 제조업 패러다임 전환',
      overview:
        '제조업체들이 제품 수명 연장과 재활용을 핵심 전략으로 채택하고 있습니다. 선형 경제에서 순환 경제로의 전환이 가속화되며, 제품 설계 단계부터 재활용을 고려하는 움직임이 확산되고 있습니다.',
      highlights: [
        {
          title: 'IKEA, 가구 재활용 프로그램 확대',
          description:
            'IKEA가 중고 가구 회수 및 재판매 프로그램을 전 세계로 확대합니다. 고객이 사용한 가구를 되사서 수리 후 재판매하는 순환 모델을 구축했습니다.',
          relatedArticle: {
            id: 501,
            title: 'IKEA 순환경제 모델',
            url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
            importance: 7,
          },
        },
      ],
      sentiment: {
        overall: 'neutral',
        description:
          '순환경제 모델이 주목받고 있으나 초기 투자 비용과 소비자 인식 전환이 과제입니다. 장기적으로는 긍정적 전망이 우세합니다.',
      },
    },
    articleCount: 9,
    topKeywords: ['순환경제', '재활용', '지속가능성'],
  },
  {
    id: '6',
    reportDate: '2026-01-16',
    executiveSummary: {
      headline: '전기차 보급 가속화, 내연기관 시대 종말',
      overview:
        '전기차 판매가 전년 대비 80% 증가하며 교통 부문 탄소 배출이 크게 감소했습니다. 충전 인프라 확대와 배터리 기술 발전이 주효했으며, 주요 자동차 제조사들이 내연기관 생산 중단 계획을 발표하고 있습니다.',
      highlights: [
        {
          title: '테슬라, 저가형 모델 출시',
          description:
            '테슬라가 3만 달러대 저가형 전기차를 출시하며 대중화에 박차를 가하고 있습니다. 배터리 효율 개선으로 1회 충전 주행거리도 600km로 늘었습니다.',
          relatedArticle: {
            id: 601,
            title: '테슬라 저가형 모델',
            url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
            importance: 9,
          },
        },
      ],
      sentiment: {
        overall: 'positive',
        description:
          '전기차 시장이 폭발적으로 성장하며 관련 산업 생태계가 활성화되고 있습니다. 배터리 소재 확보와 충전 인프라 확충이 향후 과제입니다.',
      },
    },
    articleCount: 11,
    topKeywords: ['전기차', '그린 모빌리티', '배터리'],
  },
]

export const DailyReports = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // TODO: Replace with actual data fetching
  const isLoading = false // Set to true to see skeleton

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="w-full  py-6 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            데일리 리포트
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: 'center',
            loop: true,
            skipSnaps: false,
            startIndex: 0,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full py-2 sm:py-4 "
        >
          <CarouselContent className="-ml-2 sm:-ml-3 ">
            {isLoading
              ? // Skeleton cards
                Array(6)
                  .fill(0)
                  .map((_, index) => {
                    const totalSlides = 6
                    const distance = Math.abs(current - index)
                    const wrappedDistance = Math.min(
                      distance,
                      totalSlides - distance,
                    )
                    const normalizedDistance = Math.min(wrappedDistance, 2) / 2
                    const scale = 1.0 - normalizedDistance * 0.15
                    const opacity = 1.0 - normalizedDistance * 0.3

                    return (
                      <CarouselItem
                        key={`skeleton-${index}`}
                        className="pl-2 sm:pl-3 basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5 overflow-visible"
                      >
                        <div
                          className="transition-all duration-500 ease-out"
                          style={{
                            transform: `scale(${scale})`,
                            opacity: opacity,
                          }}
                        >
                          <DailyReportSkeleton />
                        </div>
                      </CarouselItem>
                    )
                  })
              : // Real data
                MOCK_REPORTS.map((report, index) => {
                  // Calculate distance from center for progressive scaling
                  const totalSlides = MOCK_REPORTS.length
                  const distance = Math.abs(current - index)

                  // Handle loop wrapping
                  const wrappedDistance = Math.min(
                    distance,
                    totalSlides - distance,
                  )

                  // Calculate scale based on distance
                  const normalizedDistance = Math.min(wrappedDistance, 2) / 2
                  const scale = 1.0 - normalizedDistance * 0.15
                  const opacity = 1.0 - normalizedDistance * 0.3

                  return (
                    <CarouselItem
                      key={report.id}
                      className="pl-2 sm:pl-3 basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5 overflow-visible"
                    >
                      <div
                        className="transition-all duration-500 ease-out"
                        style={{
                          transform: `scale(${scale})`,
                          opacity: opacity,
                        }}
                      >
                        {/* Clean Modern Newspaper Card */}
                        <Card className="group cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 bg-card aspect-[3/4] w-full">
                          <div className="h-full flex flex-col">
                            {/* Main Image - Top 50% */}
                            <div className="relative h-1/2 overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <img
                                src={
                                  report.executiveSummary.highlights[0]
                                    ?.relatedArticle.url || '/placeholder.jpg'
                                }
                                alt={report.executiveSummary.headline}
                                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                                  wrappedDistance === 0 ? '' : 'grayscale'
                                }`}
                              />

                              {/* Sentiment Badge - Top Left */}
                              <div
                                className="absolute top-3 left-3"
                                title={
                                  report.executiveSummary.sentiment.description
                                }
                              >
                                <div
                                  className={`px-2.5 py-1 rounded backdrop-blur-sm ${
                                    report.executiveSummary.sentiment
                                      .overall === 'positive'
                                      ? 'bg-emerald-500/90'
                                      : report.executiveSummary.sentiment
                                            .overall === 'negative'
                                        ? 'bg-red-500/90'
                                        : report.executiveSummary.sentiment
                                              .overall === 'mixed'
                                          ? 'bg-yellow-500/90'
                                          : 'bg-gray-500/90'
                                  }`}
                                >
                                  <span className="text-xs font-medium text-white">
                                    {report.executiveSummary.sentiment
                                      .overall === 'positive' && '📈 긍정'}
                                    {report.executiveSummary.sentiment
                                      .overall === 'negative' && '📉 부정'}
                                    {report.executiveSummary.sentiment
                                      .overall === 'neutral' && '➡️ 중립'}
                                    {report.executiveSummary.sentiment
                                      .overall === 'mixed' && '🔀 혼조'}
                                  </span>
                                </div>
                              </div>

                              {/* Date Badge - Top Right */}
                              <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded">
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                  {new Date(
                                    report.reportDate,
                                  ).toLocaleDateString('ko-KR', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Content - Bottom 50% */}
                            <div className="h-1/2 p-4 flex flex-col">
                              {/* Article Count & Date */}
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span className="flex items-center gap-1">
                                  📰 {report.articleCount}개 기사 분석
                                </span>
                              </div>

                              {/* Title - Headline */}
                              <h3 className="font-bold text-responsive-lg leading-tight mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {report.executiveSummary.headline}
                              </h3>

                              {/* Summary - Overview */}
                              <p className="text-responsive-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 flex-1 leading-relaxed">
                                {report.executiveSummary.overview}
                              </p>

                              {/* Keywords */}
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                {report.topKeywords.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  )
                })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
