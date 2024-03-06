-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "classId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "passwordHash" VARCHAR(60) NOT NULL,
    "secretKey" VARCHAR(64) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "realNameFirst" TEXT,
    "realNameLast" TEXT,
    "birthday" TIMESTAMP(3),
    "sex" TEXT,
    "phone" TEXT,
    "motherTongue" TEXT,
    "describe" TEXT,
    "city" TEXT,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "coverUrl" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "classGrade" SMALLINT NOT NULL,
    "department" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "studentsCount" INTEGER,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraSubject" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "classGrade" INTEGER NOT NULL,
    "classChar" TEXT NOT NULL,
    "studentsCount" INTEGER,
    "roomId" TEXT,
    "timetableId" TEXT,

    CONSTRAINT "ExtraSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timetable" (
    "id" TEXT NOT NULL,
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
    "status" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Subject" (
    "classId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomId" TEXT,
    "timetableId" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("classId","name")
);

-- CreateTable
CREATE TABLE "SubjectName" (
    "name" TEXT NOT NULL,

    CONSTRAINT "SubjectName_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("teacherId","classId","subjectName")
);

-- CreateTable
CREATE TABLE "_UserExtraSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_classId_key" ON "User"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_roomId_key" ON "Subject"("roomId");

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
ALTER TABLE "ExtraSubject" ADD CONSTRAINT "ExtraSubject_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraSubject" ADD CONSTRAINT "ExtraSubject_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("number") ON DELETE SET NULL ON UPDATE CASCADE;

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
