const httpStatus = require("http-status");

const router = require("express").Router();

const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const saltRounds = 10;

router.post("/register", (req, res) => {
  try {
    // すでに登録されているメールアドレスかどうかを確認
    const findUser = User.findOne({ email: req.body.email });
    if (findUser && findUser.isVerified)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send("このメールアドレスはすでに登録されています。");

    const hashedPassword = bcrypt.hash(req.body.password, saltRounds);

    const token = crypto.randomBytes(16).toString("hex");

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, // ハッシュ化されたパスワードを保存
      confirmationToken: token,
      isVerified: false,
    });

    const user = newUser.save();
    sendConfirmationEmail(req.body.email, token);

    return res
      .status(httpStatus.OK)
      .json({ message: "Confirmation email sent", user: user._id });
  } catch (err) {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

router.get("/confirm-email", async (req, res) => {
  try {
    const { token } = req.query; // クエリパラメータからtokenを取得

    const user = await User.findOne({ confirmationToken: token });
    if (!user)
      return res.status(httpStatus.BAD_REQUEST).send("無効なトークンです。");

    // 秘密鍵を生成
    const newSecretKey = crypto.randomBytes(32).toString("hex");

    user.isVerified = true; // アカウントを認証済みに設定
    user.secretKey = newSecretKey; // 生成した秘密鍵をユーザーに保存
    await user.save();

    return res.status(httpStatus.OK).send("アカウントが認証されました。");
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status().send("ユーザーが見つかりません");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(httpStatus.BAD_REQUEST).json("パスワードが違います");

    if (!user.secretKey) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("サーバー内部エラー: ユーザーの秘密鍵が見つかりません");
    }

    // JWTの署名
    const token = await signJWT(user, { userId: user._id });

    // ユーザー情報からpasswordと他の不要なフィールドを除外
    const {
      password,
      secretKey,
      confirmationToken,
      createdAt,
      updatedAt,
      ...userResponse
    } = user.toObject();

    return res.status(httpStatus.OK).json({ user: userResponse, token }); // トークンも応答として返します
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

async function sendConfirmationEmail(email, token) {
  const transporter = nodemailer.createTransport({
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
  return jwt.sign(payload, secret);
}

async function verifyJWT(user, token) {
  const secret = user.secretKey;
  if (!secret) {
    throw new Error("No secret key found for the given user.");
  }
  return jwt.verify(token, secret);
}

module.exports = router;
