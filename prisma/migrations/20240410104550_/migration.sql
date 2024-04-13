/*
  Warnings:

  - You are about to drop the column `className` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CommonLecture` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `Subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "className",
ADD COLUMN     "name" VARCHAR(2);

-- AlterTable
ALTER TABLE "CommonLecture" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "count",
ADD COLUMN     "credit" SMALLINT;
