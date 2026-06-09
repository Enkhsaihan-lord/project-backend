/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "seriesNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "videoUrl" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);

-- CreateTable
CREATE TABLE "SeriesInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "episodeNumber" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM',
    "seriesId" TEXT,
    CONSTRAINT "SeriesInfo_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);
INSERT INTO "new_Admin" ("email", "id", "name", "password", "role", "subscription") SELECT "email", "id", "name", "password", "role", "subscription" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE UNIQUE INDEX "Admin_name_key" ON "Admin"("name");
CREATE TABLE "new_MovieInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "videoUrl" TEXT,
    "releaseDate" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);
INSERT INTO "new_MovieInfo" ("description", "id", "image", "name", "number", "subscription", "videoUrl") SELECT "description", "id", "image", "name", "number", "subscription", "videoUrl" FROM "MovieInfo";
DROP TABLE "MovieInfo";
ALTER TABLE "new_MovieInfo" RENAME TO "MovieInfo";
CREATE TABLE "new_SuperAdmin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPERADMIN',
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);
INSERT INTO "new_SuperAdmin" ("email", "id", "name", "password", "role", "subscription") SELECT "email", "id", "name", "password", "role", "subscription" FROM "SuperAdmin";
DROP TABLE "SuperAdmin";
ALTER TABLE "new_SuperAdmin" RENAME TO "SuperAdmin";
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "SuperAdmin"("email");
CREATE UNIQUE INDEX "SuperAdmin_name_key" ON "SuperAdmin"("name");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "subscription" TEXT NOT NULL DEFAULT 'NORMAL',
    "verificationCode" TEXT,
    "codeExpiresAt" DATETIME,
    "subscriptionExpiresAt" DATETIME
);
INSERT INTO "new_User" ("codeExpiresAt", "email", "id", "name", "password", "role", "subscription", "verificationCode") SELECT "codeExpiresAt", "email", "id", "name", "password", "role", "subscription", "verificationCode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
