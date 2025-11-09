import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/client';
import { users } from '../database/schema';
import { generateToken } from '../utils/jwt';
import { eq } from 'drizzle-orm';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, referralCode } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let referredBy = null;
    if (referralCode) {
      const referrer = await db.query.users.findFirst({
        where: eq(users.referralCode, referralCode),
      });
      if (referrer) {
        referredBy = referralCode;
      } else {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    const newUser = await db.insert(users).values({
      username,
      email,
      passwordHash,
      role: 'user',
      balance: '0.00',
      referralCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Generate a unique referral code
      referredBy,
    }).returning();

    const token = generateToken(newUser[0]);

    res.status(201).json({ message: 'User registered successfully', token, user: newUser[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Logged in successfully', token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // This endpoint assumes authenticateToken middleware has already run and populated req.user
  // @ts-ignore
  const userId = req.user?.id;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        passwordHash: false, // Exclude password hash from the response
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
