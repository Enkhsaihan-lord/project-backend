-- Add missing columns to User
ALTER TABLE "User" ADD COLUMN "verificationCode" TEXT;
ALTER TABLE "User" ADD COLUMN "codeExpiresAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "subscriptionExpiresAt" DATETIME;

-- Create Series table
CREATE TABLE "Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "seriesNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "videoUrl" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);

-- Create SeriesInfo table
CREATE TABLE "SeriesInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "episodeNumber" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM',
    "seriesId" TEXT,
    FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Recreate MovieInfo: remove number, add releaseDate
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
INSERT INTO "new_MovieInfo" ("id", "name", "description", "image", "videoUrl", "subscription")
    SELECT "id", "name", "description", "image", "videoUrl", "subscription" FROM "MovieInfo";
DROP TABLE "MovieInfo";
ALTER TABLE "new_MovieInfo" RENAME TO "MovieInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
