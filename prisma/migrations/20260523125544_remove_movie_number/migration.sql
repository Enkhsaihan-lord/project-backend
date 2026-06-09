/*
  Warnings:

  - You are about to drop the column `number` on the `MovieInfo` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SubPayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MovieInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "videoUrl" TEXT,
    "releaseDate" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);
INSERT INTO "new_MovieInfo" ("description", "id", "image", "name", "releaseDate", "subscription", "videoUrl") SELECT "description", "id", "image", "name", "releaseDate", "subscription", "videoUrl" FROM "MovieInfo";
DROP TABLE "MovieInfo";
ALTER TABLE "new_MovieInfo" RENAME TO "MovieInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
