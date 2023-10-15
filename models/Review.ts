import mongoose from "mongoose";

export type ReviewType = {
  userId: mongoose.Schema.Types.ObjectId;
  score: number;
  desc?: string;
};

const ReviewSchema = new mongoose.Schema<ReviewType>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  score: {
    type: Number,
    max: 5,
    min: 1,
    default: 3,
  },
  desc: {
    type: String,
    max: 200,
  },
});

const Review = mongoose.model<ReviewType>("Review", ReviewSchema);

export default Review;
