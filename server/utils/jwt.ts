import jwt from 'jsonwebtoken';
import { users } from '../database/schema';
import { InferSelectModel } from 'drizzle-orm';

type User = InferSelectModel<typeof users>;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development

export const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
