import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { auth } from '@clerk/tanstack-react-start/server'
import { getDb } from '@/db'
import { userPreferences, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { CategoryWeightSchema } from '@/db/schema'

// 사용자 선호도 업데이트 입력 스키마
const UpdatePreferencesInputSchema = z.object({
  topCategories: z.array(CategoryWeightSchema),
  topKeywords: z.array(z.string()),
  preferredSources: z.array(z.string()),
  sentimentBias: z
    .enum(['positive', 'negative', 'neutral', 'mixed'])
    .nullable()
    .optional(),
})

// 사용자 선호도 조회
export const getUserPreferences = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId } = await auth()

    if (!userId) {
      return null
    }

    const db = getDb()

    const result = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    return result[0] ?? null
  },
)

// 사용자 선호도 저장/업데이트
export const updateUserPreferences = createServerFn({ method: 'POST' })
  .inputValidator(zodValidator(UpdatePreferencesInputSchema))
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // 사용자 존재 확인
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (!existingUser[0]) {
      await db.insert(users).values({ clerkId: userId })
    }

    // 기존 선호도 확인
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    if (existing[0]) {
      // 업데이트
      await db
        .update(userPreferences)
        .set({
          topCategories: data.topCategories,
          topKeywords: data.topKeywords,
          preferredSources: data.preferredSources,
          sentimentBias: data.sentimentBias ?? null,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
    } else {
      // 새로 생성
      await db.insert(userPreferences).values({
        userId,
        topCategories: data.topCategories,
        topKeywords: data.topKeywords,
        preferredSources: data.preferredSources,
        sentimentBias: data.sentimentBias ?? null,
      })
    }

    // 업데이트된 선호도 반환
    const updated = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    return updated[0] ?? null
  })
