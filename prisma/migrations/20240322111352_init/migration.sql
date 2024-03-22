-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "classId" UUID,
    "inChargeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "remark" VARCHAR(400) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProject" (
    "userId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" UUID NOT NULL,
    "credLevel" SMALLINT NOT NULL DEFAULT 2,
    "passwordHash" VARCHAR(60) NOT NULL,
    "secretKey" VARCHAR(64),
    "confirmToken" VARCHAR(32) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "userId" UUID NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "realNameFirst" VARCHAR(15),
    "realNameLast" VARCHAR(15),
    "studentNumber" VARCHAR(8),
    "birthday" DATE,
    "sex" CHAR(6),
    "phone" VARCHAR(11),
    "motherTongue" VARCHAR(20),
    "describe" VARCHAR(200),
    "city" VARCHAR(20),
    "avatarUrl" VARCHAR(100) NOT NULL DEFAULT '',
    "coverUrl" VARCHAR(100) NOT NULL DEFAULT '',
    "userId" UUID NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" UUID NOT NULL,
    "grade" SMALLINT NOT NULL,
    "department" VARCHAR(20) NOT NULL,
    "course" VARCHAR(20),
    "className" VARCHAR(2),
    "studentsCount" SMALLINT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "count" SMALLINT,
    "isRequire" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraLecture" (
    "id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "roomNumber" VARCHAR(3),
    "timetableId" UUID,

    CONSTRAINT "ExtraLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timetable" (
    "id" UUID NOT NULL,
    "dayOfWeek" SMALLINT NOT NULL,
    "period" SMALLINT NOT NULL,
    "starttime" TIME NOT NULL,
    "endtime" TIME NOT NULL,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "number" VARCHAR(3) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "seats" INTEGER,
    "status" VARCHAR(10),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "CommonLecture" (
    "id" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "subjectId" UUID NOT NULL,
    "roomNumber" VARCHAR(3),
    "timetableId" UUID,

    CONSTRAINT "CommonLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InCharge" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "InCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassCommonLecture" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherSubject" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UserExtraLecture" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherExtraLecture" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherCommonLecture" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_confirmToken_key" ON "Auth"("confirmToken");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommonLecture_roomNumber_key" ON "CommonLecture"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_name_key" ON "Teacher"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InCharge_teacherId_key" ON "InCharge"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassCommonLecture_AB_unique" ON "_ClassCommonLecture"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassCommonLecture_B_index" ON "_ClassCommonLecture"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherSubject_AB_unique" ON "_TeacherSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherSubject_B_index" ON "_TeacherSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserExtraLecture_AB_unique" ON "_UserExtraLecture"("A", "B");

-- CreateIndex
CREATE INDEX "_UserExtraLecture_B_index" ON "_UserExtraLecture"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherExtraLecture_AB_unique" ON "_TeacherExtraLecture"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherExtraLecture_B_index" ON "_TeacherExtraLecture"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherCommonLecture_AB_unique" ON "_TeacherCommonLecture"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherCommonLecture_B_index" ON "_TeacherCommonLecture"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inChargeId_fkey" FOREIGN KEY ("inChargeId") REFERENCES "InCharge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraLecture" ADD CONSTRAINT "ExtraLecture_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraLecture" ADD CONSTRAINT "ExtraLecture_roomNumber_fkey" FOREIGN KEY ("roomNumber") REFERENCES "Room"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraLecture" ADD CONSTRAINT "ExtraLecture_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonLecture" ADD CONSTRAINT "CommonLecture_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonLecture" ADD CONSTRAINT "CommonLecture_roomNumber_fkey" FOREIGN KEY ("roomNumber") REFERENCES "Room"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonLecture" ADD CONSTRAINT "CommonLecture_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InCharge" ADD CONSTRAINT "InCharge_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCommonLecture" ADD CONSTRAINT "_ClassCommonLecture_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCommonLecture" ADD CONSTRAINT "_ClassCommonLecture_B_fkey" FOREIGN KEY ("B") REFERENCES "CommonLecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherSubject" ADD CONSTRAINT "_TeacherSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherSubject" ADD CONSTRAINT "_TeacherSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserExtraLecture" ADD CONSTRAINT "_UserExtraLecture_A_fkey" FOREIGN KEY ("A") REFERENCES "ExtraLecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserExtraLecture" ADD CONSTRAINT "_UserExtraLecture_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherExtraLecture" ADD CONSTRAINT "_TeacherExtraLecture_A_fkey" FOREIGN KEY ("A") REFERENCES "ExtraLecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherExtraLecture" ADD CONSTRAINT "_TeacherExtraLecture_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherCommonLecture" ADD CONSTRAINT "_TeacherCommonLecture_A_fkey" FOREIGN KEY ("A") REFERENCES "CommonLecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherCommonLecture" ADD CONSTRAINT "_TeacherCommonLecture_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
