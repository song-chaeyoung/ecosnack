import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { users } from './users'

// ============================================
// User Preferences Zod 스키마
// ============================================

// 카테고리 가중치
export const CategoryWeightSchema = z.object({
  category: z.string(),
  weight: z.number().min(0).max(1),
  count: z.number().int().min(0),
})

// 사용자 선호도 전체
export const UserPreferencesDataSchema = z.object({
  topCategories: z.array(CategoryWeightSchema),
  topKeywords: z.array(z.string()),
  preferredSources: z.array(z.string()),
  sentimentBias: z.enum(['positive', 'negative', 'neutral', 'mixed']).nullable(),
})

// 타입 추출
export type CategoryWeight = z.infer<typeof CategoryWeightSchema>
export type UserPreferencesData = z.infer<typeof UserPreferencesDataSchema>

// ============================================
// User Preferences 테이블 정의
// ============================================

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .unique()
    .references(() => users.clerkId, { onDelete: 'cascade' }),

  // 선호도 데이터
  topCategories: jsonb('top_categories').$type<CategoryWeight[]>().notNull(),
  topKeywords: text('top_keywords').array().notNull().default([]),
  preferredSources: text('preferred_sources').array().notNull().default([]),
  sentimentBias: varchar('sentiment_bias', { length: 20 }),

  // 메타데이터
  bookmarkCount: integer('bookmark_count').notNull().default(0),
  lastBookmarkId: integer('last_bookmark_id'),
  analyzedAt: timestamp('analyzed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type UserPreference = typeof userPreferences.$inferSelect
export type NewUserPreference = typeof userPreferences.$inferInsert
