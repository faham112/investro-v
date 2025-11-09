import { Request, Response } from 'express';
import { db } from '../database/client';
import { users, investmentPlans, transactions, referralCommissions } from '../database/schema';
import { eq, desc } from 'drizzle-orm';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const getUserDashboard = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        passwordHash: false,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const plans = await db.query.investmentPlans.findMany({
      where: eq(investmentPlans.userId, userId),
      orderBy: [desc(investmentPlans.createdAt)],
    });

    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: [desc(transactions.createdAt)],
    });

    const referrals = await db.query.referralCommissions.findMany({
      where: eq(referralCommissions.referrerId, userId),
      with: {
        referredUser: {
          columns: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: [desc(referralCommissions.createdAt)],
    });

    res.status(200).json({ user, plans, transactions: userTransactions, referrals });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createInvestmentPlan = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { planName, amount, dailyProfit, durationDays } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!planName || !amount || !dailyProfit || !durationDays) {
    return res.status(400).json({ message: 'All plan fields are required' });
  }

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance or user not found' });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const newPlan = await db.insert(investmentPlans).values({
      userId,
      planName,
      amount: amount.toString(),
      dailyProfit: dailyProfit.toString(),
      durationDays,
      endDate,
      isActive: true,
    }).returning();

    // Deduct amount from user balance
    await db.update(users)
      .set({ balance: (parseFloat(user.balance) - parseFloat(amount)).toString() })
      .where(eq(users.id, userId));

    res.status(201).json({ message: 'Investment plan created successfully', plan: newPlan[0] });
  } catch (error) {
    console.error('Create investment plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const depositFunds = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { amount, proofImageUrl } = req.body; // proofImageUrl will come from multer upload

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const newTransaction = await db.insert(transactions).values({
      userId,
      type: 'deposit',
      amount: amount.toString(),
      status: 'pending', // Admin needs to approve deposits
      proofImageUrl: proofImageUrl || null,
    }).returning();

    res.status(201).json({ message: 'Deposit request submitted', transaction: newTransaction[0] });
  } catch (error) {
    console.error('Deposit funds error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const withdrawFunds = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { amount } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance or user not found' });
    }

    const newTransaction = await db.insert(transactions).values({
      userId,
      type: 'withdrawal',
      amount: amount.toString(),
      status: 'pending', // Admin needs to approve withdrawals
    }).returning();

    // Deduct amount from user balance immediately, will be reversed if admin rejects
    await db.update(users)
      .set({ balance: (parseFloat(user.balance) - parseFloat(amount)).toString() })
      .where(eq(users.id, userId));

    res.status(201).json({ message: 'Withdrawal request submitted', transaction: newTransaction[0] });
  } catch (error) {
    console.error('Withdraw funds error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
