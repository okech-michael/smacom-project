import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const createResetToken = (userId) => {
  return jwt.sign({ userId, purpose: 'reset_password' }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyResetToken = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  if (payload.purpose !== 'reset_password') {
    throw new Error('Invalid reset token');
  }
  return payload.userId;
};

export const formatUser = (user) => {
  const { password_hash, otp_code, otp_expires, ...rest } = user;
  return rest;
};

export const entityNameMap = {
  User: 'user',
  WasteReport: 'wasteReport',
  Product: 'product',
  Order: 'order',
  OrderItem: 'orderItem',
  Course: 'course',
  Lesson: 'lesson',
  Enrollment: 'enrollment',
  CreditWallet: 'creditWallet',
  Transaction: 'transaction',
  Subscription: 'subscription',
  IoTDevice: 'iOTDevice',
  SensorReading: 'sensorReading',
  Inventory: 'inventory',
  Notification: 'notification',
};

export const normalizeFilter = (filter = {}) => {
  const normalized = { ...filter };
  if (normalized.created_by_id) {
    normalized.user_id = normalized.created_by_id;
    delete normalized.created_by_id;
  }
  return normalized;
};

export const parseSort = (sort = '-created_date') => {
  if (!sort) return { created_date: 'desc' };
  const direction = sort.startsWith('-') ? 'desc' : 'asc';
  const field = sort.replace(/^-/, '');
  return { [field]: direction };
};

export const pick = (obj, allowed = []) => {
  return Object.keys(obj).reduce((result, key) => {
    if (allowed.includes(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};
