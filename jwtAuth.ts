import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import User, { UserType } from "./models/User";
import jwt from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user?: {
    id: Types.ObjectId;
    credLevel: number;
  };
}

async function verifyJWT(user: UserType, token: string) {
  const secret = user.secretKey;
  if (!secret) {
    throw new Error("No secret key found for the given user.");
  }
  return jwt.verify(token, secret);
}

export const authenticateJWT = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "トークンが必要です" });
  }

  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const decoded = await verifyJWT(user, token);

    // decodedがstring型かどうかチェック
    if (typeof decoded === "string") {
      // エラー処理か何か
      return res.status(403).json({ message: "無効なトークン" });
    }

    req.user = decoded as { id: Types.ObjectId; credLevel: number }; // 型アサーション
    next();
  } catch (err) {
    return res.status(403).json({ message: "無効なトークン" });
  }
};
