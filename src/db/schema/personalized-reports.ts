import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  date,
  unique,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { users } from './users'
import {
  ExecutiveSummarySchema,
  MarketOverviewSchema,
  KeyInsightSchema,
  DailySentimentAnalysisSchema,
  type ExecutiveSummary,
  type MarketOverview,
  type KeyInsight,
  type DailySentimentAnalysis,
} from './daily-reports'
import { CategoryWeightSchema } from './user-preferences'
import type { CategoryWeight } from './user-preferences'

// ============================================
// Personalized Reports Zod 스키마
// ============================================

// 선호도 스냅샷 (리포트 생성 시점)
export const PreferenceSnapshotSchema = z.object({
  topCategories: z.array(CategoryWeightSchema),
  topKeywords: z.array(z.string()),
  sentimentBias: z.enum(['positive', 'negative', 'neutral', 'mixed']).nullable(),
})

// 전체 개인화 리포트 스키마
export const PersonalizedReportDataSchema = z.object({
  title: z.string(),
  executiveSummary: ExecutiveSummarySchema,
  marketOverview: MarketOverviewSchema,
  keyInsights: z.array(KeyInsightSchema),
  topKeywords: z.array(z.string()),
  sentimentAnalysis: DailySentimentAnalysisSchema,
  articleCount: z.number().int(),
  articleIds: z.array(z.number().int()),
  preferenceSnapshot: PreferenceSnapshotSchema.optional(),
})

// 타입 추출
export type PreferenceSnapshot = z.infer<typeof PreferenceSnapshotSchema>
export type PersonalizedReportData = z.infer<typeof PersonalizedReportDataSchema>

// ============================================
// Personalized Daily Reports 테이블 정의
// ============================================

export const personalizedDailyReports = pgTable(
  'personalized_daily_reports',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    reportDate: date('report_date').notNull(),
    title: text('title').notNull(),

    // 리포트 콘텐츠 (기존 DailyReport와 동일 구조)
    executiveSummary: jsonb('executive_summary').$type<ExecutiveSummary>().notNull(),
    marketOverview: jsonb('market_overview').$type<MarketOverview>().notNull(),
    keyInsights: jsonb('key_insights').$type<KeyInsight[]>().notNull(),

    // 메타데이터
    topKeywords: text('top_keywords').array().notNull().default([]),
    sentimentAnalysis: jsonb('sentiment_analysis')
      .$type<DailySentimentAnalysis>()
      .notNull(),
    articleCount: integer('article_count').notNull().default(0),
    articleIds: integer('article_ids').array().notNull().default([]),

    // 개인화 메타데이터
    preferenceSnapshot: jsonb('preference_snapshot').$type<PreferenceSnapshot>(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.userId, table.reportDate)]
)

export type PersonalizedDailyReport = typeof personalizedDailyReports.$inferSelect
export type NewPersonalizedDailyReport = typeof personalizedDailyReports.$inferInsert
