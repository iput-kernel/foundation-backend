import mongoose from "mongoose";
import { AuthType } from "./Auth";
import { ClassType } from "../Class";
import { ProfileType } from "./Profile";

export type UserType = {
  handleName: string;
  realNameFirst: string;
  realNameLast: string;
  email: string;
  password: string;
  isVerified: boolean;
  confirmationToken: string;
  auth: AuthType;
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  class: ClassType;
  profile: ProfileType;
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
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model<UserType>("User", UserSchema);

export default User;
