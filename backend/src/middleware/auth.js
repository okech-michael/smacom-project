import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma } from '../config/db.js';
import { isValidRole } from '../config/roles.js';

dotenv.config();

const secret = process.env.JWT_SECRET || 'supersecret';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization || req.query.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const tokenUser = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({ where: { id: tokenUser.id } });
    if (!user) {
      return res.status(401).json({ error: 'User account not found' });
    }
    if (!isValidRole(user.role)) {
      return res.status(403).json({ error: 'Account role is invalid' });
    }
    const { password_hash, otp_code, otp_expires, ...safeUser } = user;
    req.user = { ...tokenUser, ...safeUser };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
