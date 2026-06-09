-- Migration number: 0001 	 2026-04-17T12:50:02.755Z

-- CreateTable
CREATE TABLE "MovieInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "videoUrl" TEXT,
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "clerkId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "subscription" TEXT NOT NULL DEFAULT 'NORMAL'
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "clerkId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "clerkId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'SUPERADMIN',
    "subscription" TEXT NOT NULL DEFAULT 'PREMIUM'
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieInfo_number_key" ON "MovieInfo"("number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_name_key" ON "Admin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkId_key" ON "Admin"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "SuperAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_name_key" ON "SuperAdmin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_clerkId_key" ON "SuperAdmin"("clerkId");
