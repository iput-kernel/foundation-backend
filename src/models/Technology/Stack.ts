import mongoose from 'mongoose';

export type StackType = {
  name: string;
  way : string;
  desc: string;
};

const StackSchema = new mongoose.Schema<StackType>({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 64,
  },
  way: {
    type: String,
    required: true,
    min: 1,
    max: 64,
  },
  desc: {
    type: String,
    required: true,
    min: 1,
    max: 512,
  },
});

const Stack = mongoose.model<StackType>('Stack', StackSchema);

export default Stack;