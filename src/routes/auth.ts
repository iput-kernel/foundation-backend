import bcrypt from "bcrypt";
import crypto from "crypto";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import User, { UserType } from "../models/Account/User";

import nodemailer from "nodemailer";
import { Router } from "express";
import mongoose from "mongoose";
import Auth, { authDefaultModel } from "../models/Account/Auth";
import Profile from "../models/Account/Profile";

const authRoute = Router();

const saltRounds = 10;

authRoute.post("/register", async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });
    if (findUser && findUser.isVerified)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send("このメールアドレスはすでに登録されています。");

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const token = crypto.randomBytes(16).toString("hex");

    if (findUser) {
      // 既存のユーザーが存在する場合、トークンを更新
      findUser.confirmationToken = token;
      await findUser.save();
    } else {
      // User作成
      await createNewUserWithAuthAndProfile(
        req.body.username,
        req.body.email,
        hashedPassword,
        token
      ).catch((err) => {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      });
    }

    const user = await User.findOne({ email: req.body.email });

    await sendConfirmationEmail(user!.email, token);

    return res
      .status(httpStatus.OK)
      .json({ message: "Confirmation email sent", user: user!._id });
  } catch (err) {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

authRoute.get("/confirm-email", async (req, res) => {
  try {
    const { token } = req.query; // クエリパラメータからtokenを取得

    const user = await User.findOne({ confirmationToken: token }).populate({
      path: "auth",
      model: "Auth",
    });

    if (!user)
      return res.status(httpStatus.BAD_REQUEST).send("無効なトークンです。");

    // 秘密鍵を生成
    const newSecretKey = crypto.randomBytes(32).toString("hex");

    user.isVerified = true; // アカウントを認証済みに設定
    user.auth.secretKey = newSecretKey; // 生成した秘密鍵をユーザーに保存
    await user.save();
    const auth = await Auth.findOne({ _id: user.auth });
    if (!auth) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("ユーザに紐づくAuth Documentが存在しません");
    }
    auth!.secretKey = newSecretKey;
    auth.save();

    return res.status(httpStatus.OK).send("アカウントが認証されました。");
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
      .populate({
        path: "auth",
        model: "Auth",
      });
    if (!user) return res.status(404).send("ユーザーが見つかりません");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(httpStatus.BAD_REQUEST).json("パスワードが違います");

    if (!user.auth.secretKey) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("サーバー内部エラー: ユーザーの秘密鍵が見つかりません");
    }
    console.log(user);
    console.log(user.auth);
    // JWTの署名
    const token = await signJWT(user, {
      id: user._id,
      credLevel: user.auth.credLevel,
    });

    // ユーザー情報からpasswordと他の不要なフィールドを除外
    const { password, auth, confirmationToken, ...userResponse } = user.toObject(); // eslint-disable-line @typescript-eslint/no-unused-vars

    return res.status(httpStatus.OK).json({ user: userResponse, token }); // トークンも応答として返します
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

async function sendConfirmationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "iput.kernel@gmail.com",
      pass: process.env.MAILPASS,
    },
  });

  // リンクをクエリパラメータ形式に変更
  const link = `https://www.iput-kernel.com/v1/auth/confirm-email?token=${token}`;

  const mailOptions = {
    from: "iput-kernel@gmail.com",
    to: email,
    subject: "アカウント登録",
    text: "このリンクをクリックすれば有効化されるよ: " + link,
  };

  await transporter.sendMail(mailOptions);
}

async function signJWT(user: UserType, payload: Record<string, unknown>) {
  const secret = user.auth.secretKey;
  if (!secret) {
    throw new Error("No secret key found for the given user.");
  }
  return jwt.sign(payload, secret);
}

async function createNewUserWithAuthAndProfile(
  userName: string,
  email: string,
  password: string,
  token: string
): Promise<UserType> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auth = authDefaultModel();

    const user = new User({
      userName,
      email,
      password,
      auth: auth,
      isVerified: false,
      confirmationToken: token,
      profile: new Profile(),
    });

    // トランザクション内で保存
    await Promise.all([auth.save({ session }), user.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export default authRoute;
