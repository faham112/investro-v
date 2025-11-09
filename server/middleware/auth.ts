import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { db } from '../database/client';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === 'string') {
    return res.sendStatus(403);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.id),
  });

  if (!user) {
    return res.sendStatus(403);
  }

  req.user = { id: user.id, role: user.role };
  next();
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};
