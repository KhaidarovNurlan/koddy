import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  xp: integer('xp').default(0).notNull(),
  tokens: integer('tokens').default(0).notNull(),
  energy: integer('energy').default(5).notNull(),
  lastEnergyUpdate: timestamp('last_energy_update').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userJourneys = pgTable('user_journeys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  journeyId: text('journey_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userLessons = pgTable('user_lessons', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  journeyId: text('journey_id').notNull(),
  chapterId: text('chapter_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  passed: boolean('passed').default(false).notNull(),
  passedAt: timestamp('passed_at'),
});

export const lessonSubmissions = pgTable('lesson_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  journeyId: text('journey_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  taskId: text('task_id').notNull(),
  code: text('code').notNull(),
  passed: boolean('passed').default(false).notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});
