-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "classId" VARCHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" VARCHAR(36) NOT NULL,
    "credLevel" SMALLINT NOT NULL DEFAULT 2,
    "passwordHash" VARCHAR(60) NOT NULL,
    "secretKey" VARCHAR(64),
    "confirmToken" VARCHAR(32) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "userId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" VARCHAR(36) NOT NULL,
    "realNameFirst" VARCHAR(15),
    "realNameLast" VARCHAR(15),
    "birthday" DATE,
    "sex" CHAR(6),
    "phone" VARCHAR(11),
    "motherTongue" VARCHAR(20),
    "describe" VARCHAR(200),
    "city" VARCHAR(20),
    "avatarUrl" VARCHAR(100) NOT NULL DEFAULT '',
    "coverUrl" VARCHAR(100) NOT NULL DEFAULT '',
    "userId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" VARCHAR(36) NOT NULL,
    "classGrade" SMALLINT NOT NULL,
    "department" VARCHAR(20) NOT NULL,
    "course" VARCHAR(20) NOT NULL,
    "className" VARCHAR(2) NOT NULL,
    "studentsCount" SMALLINT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraSubject" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "roomNumber" VARCHAR(3),
    "timetableId" VARCHAR(36),

    CONSTRAINT "ExtraSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timetable" (
    "id" VARCHAR(36) NOT NULL,
    "day_of_week" SMALLINT NOT NULL,
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
CREATE TABLE "Subject" (
    "classId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "roomNumber" VARCHAR(3),
    "timetableId" VARCHAR(36),

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("classId","name")
);

-- CreateTable
CREATE TABLE "SubjectName" (
    "name" TEXT NOT NULL,

    CONSTRAINT "SubjectName_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "teacherId" VARCHAR(36) NOT NULL,
    "classId" VARCHAR(36) NOT NULL,
    "subjectName" VARCHAR(20) NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("teacherId","classId","subjectName")
);

-- CreateTable
CREATE TABLE "_UserExtraSubject" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL
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
CREATE UNIQUE INDEX "ExtraSubject_name_key" ON "ExtraSubject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_roomNumber_key" ON "Subject"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectName_name_key" ON "SubjectName"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_name_key" ON "Teacher"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserExtraSubject_AB_unique" ON "_UserExtraSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_UserExtraSubject_B_index" ON "_UserExtraSubject"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraSubject" ADD CONSTRAINT "ExtraSubject_roomNumber_fkey" FOREIGN KEY ("roomNumber") REFERENCES "Room"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraSubject" ADD CONSTRAINT "ExtraSubject_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_roomNumber_fkey" FOREIGN KEY ("roomNumber") REFERENCES "Room"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_classId_subjectName_fkey" FOREIGN KEY ("classId", "subjectName") REFERENCES "Subject"("classId", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserExtraSubject" ADD CONSTRAINT "_UserExtraSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "ExtraSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserExtraSubject" ADD CONSTRAINT "_UserExtraSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
