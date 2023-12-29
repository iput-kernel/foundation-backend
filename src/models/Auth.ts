import mongoose from "mongoose";

export type AuthType = {
    credLevel: number;
    credToken: string;
    trustLevel: number;
    isVerified: boolean;
    secretKey: string;
    userId: mongoose.Types.ObjectId;
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Auth = mongoose.model<AuthType>("Elevator", AuthSchema);

export default Auth;
