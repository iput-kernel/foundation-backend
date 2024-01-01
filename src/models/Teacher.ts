import mongoose from 'mongoose';

export type TeacherType = {
  firstName: string;
  lastName?: string;
  course: string;
};

const TeacherSchema = new mongoose.Schema<TeacherType>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  course: {
    type: String,
    default: '',
  },
});

const Teacher = mongoose.model<TeacherType>('Teacher', TeacherSchema);

export default Teacher;
