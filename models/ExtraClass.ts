import mongoose from "mongoose";

type ExtraClassType = {
  classGrade: number;
  classChar?: string;
  studentsId: mongoose.Schema.Types.ObjectId[];
  teachersId: mongoose.Schema.Types.ObjectId[];
  timetableId: mongoose.Schema.Types.ObjectId[];
};

const ExtraClassSchema = new mongoose.Schema<ExtraClassType>({
  classGrade: {
    type: Number,
    required: true,
  },
  classChar: {
    type: String,
  },
  studentsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  teachersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  timetableId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
    },
  ],
});

const ExtraClass = mongoose.model<ExtraClassType>(
  "ExtraClass",
  ExtraClassSchema
);

export default ExtraClass;
