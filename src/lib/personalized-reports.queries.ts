import { queryOptions } from '@tanstack/react-query'
import {
  getPersonalizedReports,
  getPersonalizedReportByDate,
  getPersonalizedReportWithArticles,
  getLatestPersonalizedReport,
} from './personalized-reports.api'

type PaginationOptions = {
  limit?: number
  offset?: number
}

// 개인화 리포트 목록 조회
export const personalizedReportsQueryOptions = (
  options?: PaginationOptions,
) =>
  queryOptions({
    queryKey: ['personalizedReports', 'list', options] as const,
    queryFn: () =>
      getPersonalizedReports({
        data: {
          limit: options?.limit ?? 10,
          offset: options?.offset ?? 0,
        },
      }),
  })

// 날짜별 개인화 리포트 조회
export const personalizedReportByDateQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ['personalizedReports', 'byDate', date] as const,
    queryFn: () => getPersonalizedReportByDate({ data: date }),
    enabled: !!date,
  })

// 개인화 리포트 + 연관 기사 조회
export const personalizedReportWithArticlesQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ['personalizedReports', 'withArticles', date] as const,
    queryFn: () => getPersonalizedReportWithArticles({ data: date }),
    enabled: !!date,
  })

// 최신 개인화 리포트 조회
export const latestPersonalizedReportQueryOptions = queryOptions({
  queryKey: ['personalizedReports', 'latest'] as const,
  queryFn: () => getLatestPersonalizedReport(),
  staleTime: 1000 * 60 * 5, // 5분
})
