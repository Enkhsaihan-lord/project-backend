import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getDb(db: D1Database) {
  const adapter = new PrismaD1(db);

  const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

  return prisma;
}
