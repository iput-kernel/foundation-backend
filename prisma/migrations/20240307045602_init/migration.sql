/*
  Warnings:

  - The primary key for the `SubjectName` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `SubjectName` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to drop the column `day_of_week` on the `Timetable` table. All the data in the column will be lost.
  - Added the required column `dayOfWeek` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectName" DROP CONSTRAINT "SubjectName_pkey",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "SubjectName_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Timetable" DROP COLUMN "day_of_week",
ADD COLUMN     "dayOfWeek" SMALLINT NOT NULL;
