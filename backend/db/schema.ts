import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  xp: integer('xp').default(0).notNull(),
  tokens: integer('tokens').default(0).notNull(),
  energy: integer('energy').default(5).notNull(),
  lastEnergyUpdate: timestamp('last_energy_update').defaultNow().notNull(),
  streak: integer('streak').default(0).notNull(),
  lastActiveDate: text('last_active_date'),
  activeDays: text('active_days').default('[]').notNull(),
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

export const userProjects = pgTable('user_projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  language: text('language').notNull(),
  code: text('code').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  language: text('language').notNull(),
  difficulty: text('difficulty').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courseLessons = pgTable('course_lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  expectedOutput: text('expected_output').notNull(),
  order: integer('order').default(0).notNull(),
});

export const userCourseLessons = pgTable('user_course_lessons', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  lessonId: integer('lesson_id').references(() => courseLessons.id).notNull(),
  passed: boolean('passed').default(false).notNull(),
  passedAt: timestamp('passed_at'),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  reward: text('reward'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userGoals = pgTable('user_goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(),
  goal1Current: integer('goal1_current').default(0).notNull(),
  goal1Claimed: boolean('goal1_claimed').default(false).notNull(),
  goal2Current: integer('goal2_current').default(0).notNull(),
  goal2Claimed: boolean('goal2_claimed').default(false).notNull(),
  goal3Current: integer('goal3_current').default(0).notNull(),
  goal3Claimed: boolean('goal3_claimed').default(false).notNull(),
});
