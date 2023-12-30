import mongoose from "mongoose";

export type ExtraClassType = {
  createdUser: mongoose.Types.ObjectId;
  extraClassName: string;
  studentsId: mongoose.Schema.Types.ObjectId[];
  teachersId: mongoose.Schema.Types.ObjectId[];
  timetableId: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
};

const ExtraClassSchema = new mongoose.Schema<ExtraClassType>({
  createdUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  extraClassName: {
    type: String,
    required: true,
    min: 1,
    max: 64,
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
  createdAt: { // 追加
    type: Date,
    default: Date.now,
    index: { expires: '1y' } // 1年後に削除
  },
});

const ExtraClass = mongoose.model<ExtraClassType>(
  "ExtraClass",
  ExtraClassSchema
);

export default ExtraClass;
