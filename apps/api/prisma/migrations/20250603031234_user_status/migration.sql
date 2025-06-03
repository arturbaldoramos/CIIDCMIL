/*
  Warnings:

  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "active",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
