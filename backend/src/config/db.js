import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

export const prisma = globalForPrisma.prisma;
