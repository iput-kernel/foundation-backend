import mongoose from 'mongoose';

export type ToolType = {
  name: string;
  way : string;
  desc: string;
};

const ToolSchema = new mongoose.Schema<ToolType>({
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

const Tool = mongoose.model<ToolType>('Tool', ToolSchema);

export default Tool;