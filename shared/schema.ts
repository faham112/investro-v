import { pgTable, text, serial, boolean, decimal, integer, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  totalBalance: decimal("total_balance", { precision: 15, scale: 2 }).default("0.00"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  isOnline: boolean("is_online").default(false),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  emailIdx: index("idx_users_email").on(table.email),
  referralCodeIdx: index("idx_users_referral_code").on(table.referralCode),
}));

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique(),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investmentPlans = pgTable("investment_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  minAmount: decimal("min_amount", { precision: 15, scale: 2 }).notNull(),
  maxAmount: decimal("max_amount", { precision: 15, scale: 2 }).notNull(),
  duration: integer("duration").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deposits = pgTable("deposits", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  transactionHash: text("transaction_hash"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"),
  walletAddress: text("wallet_address"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  planId: integer("plan_id").references(() => investmentPlans.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: text("status").default("active"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_investments_user_id").on(table.userId),
}));

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_transactions_user_id").on(table.userId),
}));

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: uuid("referrer_id").references(() => users.id),
  referredId: uuid("referred_id").references(() => users.id),
  level: integer("level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  referrerIdx: index("idx_referrals_referrer").on(table.referrerId),
  referredIdx: index("idx_referrals_referred").on(table.referredId),
}));

export const referralCommissions = pgTable("referral_commissions", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull(),
  commissionPercentage: decimal("commission_percentage", { precision: 5, scale: 2 }).notNull(),
  bonusPercentage: decimal("bonus_percentage", { precision: 5, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralBonuses = pgTable("referral_bonuses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  referrerId: uuid("referrer_id").references(() => users.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  level: integer("level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const platformStats = pgTable("platform_stats", {
  id: serial("id").primaryKey(),
  totalUsers: integer("total_users").default(0),
  onlineUsers: integer("online_users").default(0),
  totalInvestments: integer("total_investments").default(0),
  totalInvestedAmount: decimal("total_invested_amount", { precision: 15, scale: 2 }).default("0.00"),
  totalProfitPaid: decimal("total_profit_paid", { precision: 15, scale: 2 }).default("0.00"),
  totalTransactions: integer("total_transactions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  investments: many(investments),
  transactions: many(transactions),
  deposits: many(deposits),
  withdrawals: many(withdrawals),
  referrals: many(referrals, { relationName: "referrer" }),
  referredBy: many(referrals, { relationName: "referred" }),
  bonuses: many(referralBonuses, { relationName: "bonusRecipient" }),
  bonusesGiven: many(referralBonuses, { relationName: "bonusGiver" }),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.id],
  }),
  plan: one(investmentPlans, {
    fields: [investments.planId],
    references: [investmentPlans.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: "referred",
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;
export type InvestmentPlan = typeof investmentPlans.$inferSelect;
export type InsertInvestmentPlan = typeof investmentPlans.$inferInsert;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = typeof investments.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;
export type ReferralCommission = typeof referralCommissions.$inferSelect;
export type InsertReferralCommission = typeof referralCommissions.$inferInsert;
export type PlatformStats = typeof platformStats.$inferSelect;
export type InsertPlatformStats = typeof platformStats.$inferInsert;
