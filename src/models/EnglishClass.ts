import mongoose from "mongoose";

type EnglishClassType = {
  classGrade: number;
  classChar?: string;
  studentsId: mongoose.Schema.Types.ObjectId[];
  teachersId: mongoose.Schema.Types.ObjectId[];
  TimetableId: mongoose.Schema.Types.ObjectId[];
};

const EnglishClassSchema = new mongoose.Schema<EnglishClassType>({
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
  TimetableId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
    },
  ],
});

const EnglishClass = mongoose.model<EnglishClassType>(
  "EnglishClass",
  EnglishClassSchema,
);

export default EnglishClass;
