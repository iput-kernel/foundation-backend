import mongoose from 'mongoose';

export type SubjectType = {
  _id: mongoose.Types.ObjectId;
  subjectName: string;
  teachersId: mongoose.Types.ObjectId[];
  reviewsId: mongoose.Types.ObjectId[];
  grade?: number;
  count?: number;
  isRequire?: boolean;
};

const SubjectSchema = new mongoose.Schema<SubjectType>({
  subjectName: {
    type: String,
    default: '',
    required: true,
  },
  teachersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],
  reviewsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  grade: {
    type: Number,
  },
  count: {
    type: Number,
    default: 0,
  },
  isRequire: {
    type: Boolean,
    default: false,
  },
});

const Subject = mongoose.model<SubjectType>('Subject', SubjectSchema);

export default Subject;
