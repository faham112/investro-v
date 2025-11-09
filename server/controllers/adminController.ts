import { Request, Response } from 'express';
import { db } from '../database/client';
import { users, investmentPlans, transactions, referralCommissions } from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const adminUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(adminUser);

    res.status(200).json({ message: 'Admin logged in successfully', token, user: adminUser });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await db.query.users.findMany();
    const totalInvestmentPlans = await db.query.investmentPlans.findMany();
    const totalTransactions = await db.query.transactions.findMany();
    const pendingDeposits = await db.query.transactions.findMany({
      where: eq(transactions.status, 'pending'),
    });

    res.status(200).json({
      totalUsers: totalUsers.length,
      totalInvestmentPlans: totalInvestmentPlans.length,
      totalTransactions: totalTransactions.length,
      pendingDeposits: pendingDeposits.length,
      // Add more admin specific data as needed
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const allUsers = await db.query.users.findMany({
      columns: {
        passwordHash: false,
      },
      orderBy: [desc(users.createdAt)],
    });
    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserBalance = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const { amount, type } = req.body; // type: 'add' or 'deduct'

  if (!userId || !amount || !type) {
    return res.status(400).json({ message: 'User ID, amount, and type are required' });
  }

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, parseInt(userId)) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let newBalance = parseFloat(user.balance);
    if (type === 'add') {
      newBalance += parseFloat(amount);
    } else if (type === 'deduct') {
      newBalance -= parseFloat(amount);
    } else {
      return res.status(400).json({ message: 'Invalid type. Must be "add" or "deduct"' });
    }

    const updatedUser = await db.update(users)
      .set({ balance: newBalance.toString() })
      .where(eq(users.id, parseInt(userId)))
      .returning();

    res.status(200).json({ message: 'User balance updated successfully', user: updatedUser[0] });
  } catch (error) {
    console.error('Update user balance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveDeposit = async (req: AuthRequest, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, parseInt(transactionId)),
    });

    if (!transaction || transaction.type !== 'deposit' || transaction.status !== 'pending') {
      return res.status(404).json({ message: 'Pending deposit transaction not found' });
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, transaction.userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this transaction' });
    }

    // Update transaction status
    await db.update(transactions)
      .set({ status: 'completed', updatedAt: new Date() })
      .where(eq(transactions.id, parseInt(transactionId)));

    // Add deposit amount to user balance
    const newBalance = parseFloat(user.balance) + parseFloat(transaction.amount);
    await db.update(users)
      .set({ balance: newBalance.toString() })
      .where(eq(users.id, user.id));

    // Check for referral bonus
    if (user.referredBy) {
      const referrer = await db.query.users.findFirst({ where: eq(users.referralCode, user.referredBy) });
      if (referrer) {
        const referralBonus = parseFloat(transaction.amount) * 0.05; // 5% referral bonus
        await db.insert(referralCommissions).values({
          referrerId: referrer.id,
          referredUserId: user.id,
          amount: referralBonus.toString(),
          transactionId: transaction.id,
        });
        // Add referral bonus to referrer's balance
        await db.update(users)
          .set({ balance: (parseFloat(referrer.balance) + referralBonus).toString() })
          .where(eq(users.id, referrer.id));
      }
    }

    res.status(200).json({ message: 'Deposit approved and balance updated' });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectDeposit = async (req: AuthRequest, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, parseInt(transactionId)),
    });

    if (!transaction || transaction.type !== 'deposit' || transaction.status !== 'pending') {
      return res.status(404).json({ message: 'Pending deposit transaction not found' });
    }

    // Update transaction status to failed
    await db.update(transactions)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(transactions.id, parseInt(transactionId)));

    res.status(200).json({ message: 'Deposit rejected' });
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveWithdrawal = async (req: AuthRequest, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, parseInt(transactionId)),
    });

    if (!transaction || transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
      return res.status(404).json({ message: 'Pending withdrawal transaction not found' });
    }

    // Update transaction status
    await db.update(transactions)
      .set({ status: 'completed', updatedAt: new Date() })
      .where(eq(transactions.id, parseInt(transactionId)));

    res.status(200).json({ message: 'Withdrawal approved' });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectWithdrawal = async (req: AuthRequest, res: Response) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, parseInt(transactionId)),
    });

    if (!transaction || transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
      return res.status(404).json({ message: 'Pending withdrawal transaction not found' });
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, transaction.userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this transaction' });
    }

    // Update transaction status to failed
    await db.update(transactions)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(transactions.id, parseInt(transactionId)));

    // Refund amount to user balance
    const newBalance = parseFloat(user.balance) + parseFloat(transaction.amount);
    await db.update(users)
      .set({ balance: newBalance.toString() })
      .where(eq(users.id, user.id));

    res.status(200).json({ message: 'Withdrawal rejected and funds refunded' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
