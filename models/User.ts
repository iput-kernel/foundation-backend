import mongoose from "mongoose";

export type UserType = {
  id: string;
  username: string;
  realnameFirst: string;
  realnameLast: string;
  email: string;
  password: string;
  secretKey: string;
  confirmationToken: string;
  isVerified: boolean;
  profilePicture: string;
  coverPicture: string;
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  grade: number;
  course: string;
  classId: mongoose.Types.ObjectId;
  class: string;
  englishClass: string;
  phone: string;
  sex: string;
  birthday?: Date;
  major: string;
  motherTongue: string;
  isAdmin: boolean;
  isAnonymous: boolean;
  isFirstTime: boolean;
  credLevel: number;
  credToken: number;
  desc: string;
  city: string;
  trustLevel: number;
};

const UserSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      min: 6,
      max: 16,
      unique: true,
    },
    realnameFirst: {
      type: String,
      default: "",
      max: 32,
    },
    realnameLast: {
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
    secretKey: {
      type: String,
      unique: true,
      default: "",
    },
    confirmationToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
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
    grade: {
      type: Number,
      max: 10,
    },
    course: {
      type: String,
      max: 30,
      default: "",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    class: {
      type: String,
      max: 4,
    },
    englishClass: {
      type: String,
      max: 4,
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
    major: {
      type: String,
      max: 30,
      default: "",
    },
    motherTongue: {
      type: String,
      max: 30,
      default: "日本語",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
    credLevel: {
      type: Number,
      default: 2,
    },
    credToken: {
      type: Number,
      default: 3,
    },
    desc: {
      type: String,
      max: 128,
      default: "",
    },
    city: {
      type: String,
      max: 50,
    },
    trustLevel: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    }
  },
  { timestamps: true }
);
const User = mongoose.model<UserType>("User", UserSchema);

export default User;
