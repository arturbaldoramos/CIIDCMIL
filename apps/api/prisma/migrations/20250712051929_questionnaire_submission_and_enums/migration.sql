/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireId` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,order]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submissionId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('TEN_TO_TWENTY', 'TWENTY_ONE_TO_THIRTY', 'THIRTY_ONE_TO_FORTY', 'FORTY_ONE_TO_FIFTY', 'FIFTY_ONE_PLUS');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "Income" AS ENUM ('LESS_THAN_ONE_MINIMUM', 'ONE_TO_TWO_MINIMUM', 'TWO_TO_THREE_MINIMUM', 'MORE_THAN_FOUR_MINIMUM');

-- CreateEnum
CREATE TYPE "FeedbackQuantity" AS ENUM ('ADEQUATE', 'HIGH', 'EXCESSIVELY_HIGH');

-- CreateEnum
CREATE TYPE "FeedbackTime" AS ENUM ('ADEQUATE', 'TOO_LONG');

-- CreateEnum
CREATE TYPE "FeedbackDevice" AS ENUM ('COMPUTER_ONLY', 'SMARTPHONE_AND_COMPUTER');

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionnaireId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_questionnaireId_fkey";

-- DropIndex
DROP INDEX "Answer_questionId_key";

-- DropIndex
DROP INDEX "Question_questionnaireId_order_key";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "createdAt",
DROP COLUMN "questionnaireId",
ADD COLUMN     "submissionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "questionnaireId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Questionnaire" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QuestionCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "ageRange" "AgeRange",
    "gender" "Gender",
    "income" "Income",
    "feedbackQuantity" "FeedbackQuantity",
    "feedbackTime" "FeedbackTime",
    "feedbackDevice" "FeedbackDevice",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionnaireQuestions" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuestionnaireQuestions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionCategory_name_key" ON "QuestionCategory"("name");

-- CreateIndex
CREATE INDEX "Submission_questionnaireId_idx" ON "Submission"("questionnaireId");

-- CreateIndex
CREATE INDEX "_QuestionnaireQuestions_B_index" ON "_QuestionnaireQuestions"("B");

-- CreateIndex
CREATE INDEX "Answer_submissionId_idx" ON "Answer"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_categoryId_order_key" ON "Question"("categoryId", "order");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "QuestionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionnaireQuestions" ADD CONSTRAINT "_QuestionnaireQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionnaireQuestions" ADD CONSTRAINT "_QuestionnaireQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
