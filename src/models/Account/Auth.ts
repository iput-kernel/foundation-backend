import mongoose from 'mongoose';

export type AuthType = {
    credLevel: number;
    credToken: string;
    trustLevel: number;
    secretKey: string;
};

const AuthSchema = new mongoose.Schema<AuthType>({
    credLevel: {
        type: Number,
        default: 0,
    },
    credToken: {
        type: String,
        default: '',
    },
    trustLevel: {
        type: Number,
        default: 0,
    },
    secretKey: {
        type: String,
        default: '',
    },
});

const Auth = mongoose.model<AuthType>('Auth', AuthSchema);

export const authDefaultModel = () => {
    return new Auth<AuthType>({
        credLevel: 0,
        credToken: '',
        trustLevel: 0,
        secretKey: '',
    })
}

export default Auth;
