DROP INDEX IF EXISTS "User_clerkId_key";
DROP INDEX IF EXISTS "Admin_clerkId_key";
DROP INDEX IF EXISTS "SuperAdmin_clerkId_key";
ALTER TABLE "User" DROP COLUMN "clerkId";
ALTER TABLE "Admin" DROP COLUMN "clerkId";
ALTER TABLE "SuperAdmin" DROP COLUMN "clerkId";
