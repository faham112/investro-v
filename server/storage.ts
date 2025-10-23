import { db } from "./db";
import { 
  users, admins, investmentPlans, investments, transactions, 
  referrals, referralBonuses, referralCommissions, platformStats,
  type User, type InsertUser, type Admin, type InsertAdmin,
  type InvestmentPlan, type InsertInvestmentPlan, type Investment, type InsertInvestment,
  type Transaction, type InsertTransaction, type Referral, type InsertReferral,
  type ReferralCommission, type InsertReferralCommission, type PlatformStats, type InsertPlatformStats
} from "../shared/schema";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserBalance(id: string, balance: string): Promise<void> {
    await db
      .update(users)
      .set({ totalBalance: balance })
      .where(eq(users.id, id));
  }

  // Admin operations
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(adminData).returning();
    return admin;
  }

  async updateAdminLogin(id: number): Promise<void> {
    await db
      .update(admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(admins.id, id));
  }

  // Investment plan operations
  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    try {
      const plans = await db
        .select()
        .from(investmentPlans)
        .where(eq(investmentPlans.isActive, true))
        .orderBy(investmentPlans.id);
      
      if (plans.length === 0) {
        console.log('Investment plans table empty, returning default plans');
        return [
          { id: 1, name: 'Starter Plan', description: 'Perfect for beginners', interestRate: '5.00', minAmount: '100.00', maxAmount: '999.99', duration: 7, isActive: true, createdAt: new Date() },
          { id: 2, name: 'Basic Plan', description: 'Most popular choice', interestRate: '10.00', minAmount: '1000.00', maxAmount: '4999.99', duration: 15, isActive: true, createdAt: new Date() },
          { id: 3, name: 'Standard Plan', description: 'For serious investors', interestRate: '15.00', minAmount: '5000.00', maxAmount: '9999.99', duration: 30, isActive: true, createdAt: new Date() },
          { id: 4, name: 'Premium Plan', description: 'High yield returns', interestRate: '20.00', minAmount: '10000.00', maxAmount: '24999.99', duration: 45, isActive: true, createdAt: new Date() },
          { id: 5, name: 'Professional Plan', description: 'For professionals', interestRate: '25.00', minAmount: '25000.00', maxAmount: '49999.99', duration: 60, isActive: true, createdAt: new Date() },
          { id: 6, name: 'Diamond Plan', description: 'Maximum returns', interestRate: '30.00', minAmount: '50000.00', maxAmount: '999999.99', duration: 90, isActive: true, createdAt: new Date() }
        ];
      }
      return plans;
    } catch (error) {
      console.error('Error fetching investment plans:', error);
      return [];
    }
  }

  async getInvestmentPlan(id: number): Promise<InvestmentPlan | undefined> {
    const [plan] = await db.select().from(investmentPlans).where(eq(investmentPlans.id, id));
    return plan || undefined;
  }

  async createInvestmentPlan(plan: InsertInvestmentPlan): Promise<InvestmentPlan> {
    const [newPlan] = await db.insert(investmentPlans).values(plan).returning();
    return newPlan;
  }

  async updateInvestmentPlan(id: number, updates: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    const [updatedPlan] = await db
      .update(investmentPlans)
      .set(updates)
      .where(eq(investmentPlans.id, id))
      .returning();
    return updatedPlan;
  }

  // Investment operations
  async getUserInvestments(userId: string): Promise<any[]> {
    try {
      const userInvestments = await db
        .select({
          id: investments.id,
          userId: investments.userId,
          planId: investments.planId,
          amount: investments.amount,
          status: investments.status,
          startDate: investments.startDate,
          endDate: investments.endDate,
          createdAt: investments.createdAt,
          plan: {
            name: investmentPlans.name,
            description: investmentPlans.description,
            interestRate: investmentPlans.interestRate,
            duration: investmentPlans.duration
          }
        })
        .from(investments)
        .leftJoin(investmentPlans, eq(investments.planId, investmentPlans.id))
        .where(eq(investments.userId, userId))
        .orderBy(desc(investments.createdAt));
      
      return userInvestments.map(inv => ({
        ...inv,
        investment_plans: inv.plan
      }));
    } catch (error) {
      console.error('Error fetching user investments:', error);
      return [];
    }
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  // Transaction operations
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const txs = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .orderBy(desc(transactions.createdAt));
      return txs;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const txs = await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.createdAt));
      return txs;
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      return [];
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt));
      return allUsers;
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  async getOnlineUsers(): Promise<User[]> {
    try {
      const onlineUsers = await db
        .select()
        .from(users)
        .where(eq(users.isOnline, true))
        .orderBy(desc(users.lastActiveAt));
      return onlineUsers;
    } catch (error) {
      console.error('Error fetching online users:', error);
      return [];
    }
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  // Referral operations
  async getUserReferrals(userId: string): Promise<any[]> {
    try {
      const userReferrals = await db
        .select({
          id: referrals.id,
          referrerId: referrals.referrerId,
          referredId: referrals.referredId,
          level: referrals.level,
          createdAt: referrals.createdAt,
          referred: {
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            createdAt: users.createdAt
          }
        })
        .from(referrals)
        .leftJoin(users, eq(referrals.referredId, users.id))
        .where(eq(referrals.referrerId, userId))
        .orderBy(desc(referrals.createdAt));
      
      return userReferrals;
    } catch (error) {
      console.error('Error fetching user referrals:', error);
      return [];
    }
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [newReferral] = await db.insert(referrals).values(referral).returning();
    return newReferral;
  }

  async getUserReferralBonuses(userId: string): Promise<any[]> {
    try {
      const bonuses = await db
        .select()
        .from(referralBonuses)
        .where(eq(referralBonuses.userId, userId))
        .orderBy(desc(referralBonuses.createdAt));
      return bonuses;
    } catch (error) {
      console.error('Error fetching user referral bonuses:', error);
      return [];
    }
  }

  async createReferralBonus(bonus: any): Promise<any> {
    const [newBonus] = await db.insert(referralBonuses).values(bonus).returning();
    return newBonus;
  }

  // Referral commission operations
  async getReferralCommissions(): Promise<ReferralCommission[]> {
    try {
      const commissions = await db
        .select()
        .from(referralCommissions)
        .where(eq(referralCommissions.isActive, true))
        .orderBy(referralCommissions.level);
      return commissions;
    } catch (error) {
      console.error('Error fetching referral commissions:', error);
      return [];
    }
  }

  async createReferralCommission(commission: InsertReferralCommission): Promise<ReferralCommission> {
    const [newCommission] = await db.insert(referralCommissions).values(commission).returning();
    return newCommission;
  }

  // Platform stats
  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const [stats] = await db
        .select()
        .from(platformStats)
        .orderBy(desc(platformStats.id))
        .limit(1);
      
      if (!stats) {
        const defaultStats: InsertPlatformStats = {
          totalUsers: 0,
          onlineUsers: 0,
          totalInvestments: 0,
          totalInvestedAmount: "0.00",
          totalProfitPaid: "0.00",
          totalTransactions: 0
        };
        
        const [newStats] = await db.insert(platformStats).values(defaultStats).returning();
        return newStats;
      }
      
      return stats;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        id: 1,
        totalUsers: 0,
        onlineUsers: 0,
        totalInvestments: 0,
        totalInvestedAmount: "0.00",
        totalProfitPaid: "0.00",
        totalTransactions: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }

  async updatePlatformStats(updates: Partial<PlatformStats>): Promise<void> {
    try {
      await db
        .update(platformStats)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(platformStats.id, 1));
    } catch (error) {
      console.error('Error updating platform stats:', error);
    }
  }
}

export const storage = new DatabaseStorage();
