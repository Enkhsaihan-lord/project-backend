-- AlterTable
ALTER TABLE "User" ADD COLUMN "codeExpiresAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "verificationCode" TEXT;
