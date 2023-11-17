"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const nodemailer_1 = __importDefault(require("nodemailer"));
const saltRounds = 10;
router.post("/register", async (req, res) => {
    try {
        // すでに登録されているメールアドレスかどうかを確認
        const findUser = await User_1.default.findOne({ email: req.body.email });
        if (findUser && findUser.isVerified)
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .send("このメールアドレスはすでに登録されています。");
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, saltRounds);
        const token = crypto_1.default.randomBytes(16).toString("hex");
        const newUser = new User_1.default({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            confirmationToken: token,
            isVerified: false,
        });
        await sendConfirmationEmail(req.body.email, token);
        const user = await newUser.save();
        return res
            .status(http_status_1.default.OK)
            .json({ message: "Confirmation email sent", user: user._id });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.get("/confirm-email", async (req, res) => {
    try {
        const { token } = req.query; // クエリパラメータからtokenを取得
        const user = await User_1.default.findOne({ confirmationToken: token });
        if (!user)
            return res.status(http_status_1.default.BAD_REQUEST).send("無効なトークンです。");
        // 秘密鍵を生成
        const newSecretKey = crypto_1.default.randomBytes(32).toString("hex");
        user.isVerified = true; // アカウントを認証済みに設定
        user.secretKey = newSecretKey; // 生成した秘密鍵をユーザーに保存
        await user.save();
        return res.status(http_status_1.default.OK).send("アカウントが認証されました。");
    }
    catch (err) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.post("/login", async (req, res) => {
    try {
        const user = await User_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status().send("ユーザーが見つかりません");
        const validPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(http_status_1.default.BAD_REQUEST).json("パスワードが違います");
        if (!user.secretKey) {
            return res
                .status(http_status_1.default.INTERNAL_SERVER_ERROR)
                .send("サーバー内部エラー: ユーザーの秘密鍵が見つかりません");
        }
        // JWTの署名
        const token = await signJWT(user, { userId: user._id });
        // ユーザー情報からpasswordと他の不要なフィールドを除外
        const { password, secretKey, confirmationToken, ...userResponse } = user.toObject();
        return res.status(http_status_1.default.OK).json({ user: userResponse, token }); // トークンも応答として返します
    }
    catch (err) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
async function sendConfirmationEmail(email, token) {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: "iput.kernel@gmail.com",
            pass: process.env.MAILPASS,
        },
    });
    // リンクをクエリパラメータ形式に変更
    const link = `https://www.iput-kernel.com/api/auth/confirm-email?token=${token}`;
    const mailOptions = {
        from: "iput-kernel@gmail.com",
        to: email,
        subject: "アカウント登録",
        text: "このリンクをクリックすれば有効化されるよ: " + link,
    };
    await transporter.sendMail(mailOptions);
}
async function signJWT(user, payload) {
    const secret = user.secretKey;
    if (!secret) {
        throw new Error("No secret key found for the given user.");
    }
    return jsonwebtoken_1.default.sign(payload, secret);
}
async function verifyJWT(user, token) {
    const secret = user.secretKey;
    if (!secret) {
        throw new Error("No secret key found for the given user.");
    }
    return jsonwebtoken_1.default.verify(token, secret);
}
module.exports = router;
