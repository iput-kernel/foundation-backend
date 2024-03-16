/*
  Warnings:

  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeacherSubject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `TeacherSubject` table. All the data in the column will be lost.
  - You are about to drop the column `subjectName` on the `TeacherSubject` table. All the data in the column will be lost.
  - The required column `id` was added to the `Subject` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `subjectId` to the `TeacherSubject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeacherSubject" DROP CONSTRAINT "TeacherSubject_classId_subjectName_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
ADD COLUMN     "id" VARCHAR(36) NOT NULL,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeacherSubject" DROP CONSTRAINT "TeacherSubject_pkey",
DROP COLUMN "classId",
DROP COLUMN "subjectName",
ADD COLUMN     "subjectId" VARCHAR(36) NOT NULL,
ADD CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("teacherId", "subjectId");

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
