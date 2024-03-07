/*
  Warnings:

  - A unique constraint covering the columns `[confirmToken]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Made the column `confirmToken` on table `Auth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auth" ALTER COLUMN "confirmToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_confirmToken_key" ON "Auth"("confirmToken");
