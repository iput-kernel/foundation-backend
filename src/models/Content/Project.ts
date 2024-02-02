import mongoose from 'mongoose';

export type ProjectType = {
  name: string;
  desc: string;
  field: string;
  markdown: string;
  stacksId: mongoose.Types.ObjectId[];
  toolsId: mongoose.Types.ObjectId[];
  membersId: mongoose.Types.ObjectId[];
  createdUser: mongoose.Types.ObjectId;
};

const ProjectSchema = new mongoose.Schema<ProjectType>({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 64,
  },
  field: {
    type: String,
    required: true,
    min: 1,
    max: 64,
  },
  desc: {
    type: String,
    required: true,
    min: 1,
    max: 1024,
  },
  markdown: {
    type: String,
    required: true,
    min: 1,
    max: 4096,
  },
  stacksId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stack',
    },
  ],
  toolsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool',
    },
  ],
  membersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Project = mongoose.model<ProjectType>('Project', ProjectSchema);

export default Project;