import { pgTable, serial, text, varchar, timestamp, boolean, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 256 }).notNull().unique(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(), // 'user' or 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  balance: numeric('balance', { precision: 10, scale: 2 }).default('0.00').notNull(),
  referralCode: varchar('referral_code', { length: 256 }).unique(),
  referredBy: varchar('referred_by', { length: 256 }), // Referral code of the referrer
});

export const usersRelations = relations(users, ({ many }) => ({
  investmentPlans: many(investmentPlans),
  transactions: many(transactions),
  referralCommissions: many(referralCommissions),
}));

// Investment Plans Table
export const investmentPlans = pgTable('investment_plans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  planName: varchar('plan_name', { length: 256 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  dailyProfit: numeric('daily_profit', { precision: 10, scale: 2 }).notNull(),
  durationDays: integer('duration_days').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const investmentPlansRelations = relations(investmentPlans, ({ one }) => ({
  user: one(users, {
    fields: [investmentPlans.userId],
    references: [users.id],
  }),
}));

// Transactions Table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'deposit', 'withdrawal', 'profit', 'referral_bonus'
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'completed', 'failed'
  proofImageUrl: text('proof_image_url'), // For deposit proofs
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// Referral Commissions Table
export const referralCommissions = pgTable('referral_commissions', {
  id: serial('id').primaryKey(),
  referrerId: integer('referrer_id').references(() => users.id).notNull(),
  referredUserId: integer('referred_user_id').references(() => users.id).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  transactionId: integer('transaction_id').references(() => transactions.id), // Optional: link to a specific transaction
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const referralCommissionsRelations = relations(referralCommissions, ({ one }) => ({
  referrer: one(users, {
    fields: [referralCommissions.referrerId],
    references: [users.id],
    relationName: 'referrer',
  }),
  referredUser: one(users, {
    fields: [referralCommissions.referredUserId],
    references: [users.id],
    relationName: 'referredUser',
  }),
  transaction: one(transactions, {
    fields: [referralCommissions.transactionId],
    references: [transactions.id],
  }),
}));

// Sessions Table (for JWT token invalidation/management if needed, or for traditional sessions)
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  token: text('token').notNull().unique(), // JWT token or session ID
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
