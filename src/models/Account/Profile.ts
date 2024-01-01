import mongoose from "mongoose";

export type ProfileType = {
  birthday?: Date;
  sex?: string;
  phone?: string;
  motherTongue?: string;
  describe?: string;
  city?: string;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
};

const ProfileSchema = new mongoose.Schema<ProfileType>({
  birthday: {
    type: Date,
  },
  sex: {
    type: String,
    max: 8,
    default: "",
  },
  phone: {
    type: String,
    max: 20,
    default: "",
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
  profilePictureUrl: {
    type: String,
    default: "",
  },
  coverPictureUrl: {
    type: String,
    default: "",
  },
});

const Profile = mongoose.model<ProfileType>("Profile", ProfileSchema);

export default Profile;
