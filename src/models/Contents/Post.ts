import mongoose from 'mongoose';

export type PostType = {
  userId: mongoose.Schema.Types.ObjectId;
  desc: string;
  img?: string;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

const PostSchema = new mongoose.Schema<PostType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    desc: {
      type: String,
      max: 200,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model<PostType>('Post', PostSchema);

export default Post;
