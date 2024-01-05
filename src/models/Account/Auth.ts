import mongoose from "mongoose";

export type AuthType = {
  credLevel: number;
  credToken: string;
  trustLevel: number;
  secretKey: string;
  confirmationToken: string;
};

const AuthSchema = new mongoose.Schema<AuthType>({
  credLevel: {
    type: Number,
    default: 0,
  },
  credToken: {
    type: String,
    default: "",
  },
  trustLevel: {
    type: Number,
    default: 0,
  },
  secretKey: {
    type: String,
    default: "",
  },
  confirmationToken: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const Auth = mongoose.model<AuthType>("Auth", AuthSchema);

export const authDefaultModel = (token: string) => {
  return new Auth<AuthType>({
    credLevel: 0,
    credToken: "",
    trustLevel: 0,
    secretKey: "",
    confirmationToken: token,
  });
};

export default Auth;
