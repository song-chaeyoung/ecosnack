import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { getUserPreferences, updateUserPreferences } from './user-preferences.api'
import type { CategoryWeight } from '@/db/schema'

// 사용자 선호도 조회
export const userPreferencesQueryOptions = queryOptions({
  queryKey: ['userPreferences'] as const,
  queryFn: () => getUserPreferences(),
  staleTime: 1000 * 60 * 10, // 10분
})

// 사용자 선호도 업데이트 mutation hook
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      topCategories: CategoryWeight[]
      topKeywords: string[]
      preferredSources: string[]
      sentimentBias?: 'positive' | 'negative' | 'neutral' | 'mixed' | null
    }) => updateUserPreferences({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userPreferences'],
      })
      // 선호도 변경 시 개인화 리포트도 갱신
      queryClient.invalidateQueries({
        queryKey: ['personalizedReports'],
      })
    },
  })
}
