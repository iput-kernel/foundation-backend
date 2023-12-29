import mongoose from "mongoose";
import { AuthType } from "./Auth";

export type UserType = {
  handleName: string;
  realNameFirst: string;
  realNameLast: string;
  email: string;
  password: string;
  isVerified: boolean;
  sex: string;
  phone: string;
  motherTongue: string;
  describe: string;
  city: string;
  profilePicture: string;
  coverPicture: string;
  birthday?: Date;
  confirmationToken: string;
  auth: AuthType;
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  authId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
};

const UserSchema = new mongoose.Schema<UserType>(
  {
    handleName: {
      type: String,
      required: true,
      min: 6,
      max: 16,
      unique: true,
    },
    realNameFirst: {
      type: String,
      default: "",
      max: 32,
    },
    realNameLast: {
      type: String,
      default: "",
      max: 32,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9_.+-]+@tks.iput.ac.jp/,
        "ドメインはtks.iput.ac.jpである必要があります",
      ],
      max: 319,
    },
    password: {
      type: String,
      required: true,
      min: 1,
      max: 70,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    confirmationToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    phone: {
      type: String,
      max: 20,
      default: "",
    },
    sex: {
      type: String,
      max: 8,
      default: "",
    },
    birthday: {
      type: Date,
    },
    motherTongue: {
      type: String,
      max: 30,
      default: "日本語",
    },
    describe: {
      type: String,
      max: 128,
      default: "",
    },
    city: {
      type: String,
      max: 50,
    },
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);
const User = mongoose.model<UserType>("User", UserSchema);

export default User;
