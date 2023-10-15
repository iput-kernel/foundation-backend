import mongoose from "mongoose";

export type SecretKeyType = {
  secretKey: string;
  createdAt: Date;
};
const SecretKeySchema = new mongoose.Schema<SecretKeyType>({
  secretKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // 7日後にこのドキュメントを自動的に削除する設定
  },
});

const SecretKey = mongoose.model<SecretKeyType>("SecretKey", SecretKeySchema);

export default SecretKey;
