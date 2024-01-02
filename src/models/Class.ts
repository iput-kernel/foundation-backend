import mongoose from "mongoose";
export type ClassType = {
  userId: mongoose.Schema.Types.ObjectId;
  department: string;
  course: string;
  classGrade: number;
  classChar: string;
  studentsCount: number;
  studentsId: mongoose.Types.ObjectId[];
  timetableId: mongoose.Schema.Types.ObjectId;
  startEndTime: mongoose.Schema.Types.ObjectId;
};

const ClassSchema = new mongoose.Schema<ClassType>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  department: {
    type: String,
  },
  course: {
    type: String,
  },
  classGrade: {
    type: Number,
  },
  classChar: {
    type: String,
    max: 2,
  },
  studentsCount: {
    type: Number,
  },
  studentsId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Timetable",
  },
  startEndTime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StartEndTime",
  },
});

const Class = mongoose.model<ClassType>("Class", ClassSchema);

export default Class;
