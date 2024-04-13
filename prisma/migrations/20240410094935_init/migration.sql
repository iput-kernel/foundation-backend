/*
  Warnings:

  - You are about to drop the column `endtime` on the `Timetable` table. All the data in the column will be lost.
  - You are about to drop the column `starttime` on the `Timetable` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timetable" DROP COLUMN "endtime",
DROP COLUMN "starttime",
ADD COLUMN     "endTime" TIME NOT NULL,
ADD COLUMN     "startTime" TIME NOT NULL;
