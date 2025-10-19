import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Prevents multiple instances and connection pool issues
 */

// Create a singleton Prisma Client instance
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Declare global type
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use existing instance or create new one
const prisma = globalThis.prisma ?? prismaClientSingleton();

// In development, store instance globally to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

/**
 * Graceful shutdown - disconnect database
 */
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
};
