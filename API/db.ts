import { PrismaClient } from '@prisma/client';

// A single shared client (per Prisma's recommendation) so we don't open a new
// connection pool on every import; Node's require cache makes this a singleton.
const prisma = new PrismaClient();

export const connectDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log('Connected to Postgres (Neon) via Prisma');
};

export default prisma;
