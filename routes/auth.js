const router = require('express').Router();

const User = require('../models/User');
const SecretKey = require('../models/SecretKey');  

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const nodemailer = require("nodemailer");

const saltRounds = 10;

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const token = crypto.randomBytes(16).toString("hex");

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,  // ハッシュ化されたパスワードを保存
            confirmationToken: token,
            isVerified: false
        });

        await sendConfirmationEmail(req.body.email, token);

        const user = await newUser.save();
        return res.status(200).json({ message: "Confirmation email sent", user: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("ユーザーが見つかりません");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("パスワードが違います");

        // データベースから最新の秘密鍵を取得
        const latestKeyDoc = await SecretKey.findOne().sort({ createdAt: -1 });
        if (!latestKeyDoc) return res.status(500).send("サーバー内部エラー: 秘密鍵が見つかりません");

        const secret = latestKeyDoc.secretKey;

        // JWTの署名
        const token = signJWT(user._id)

        return res.status(200).json({ user, token });  // トークンも応答として返します
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/confirm-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({ confirmationToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        user.isVerified = true;
        user.confirmationToken = undefined;
        await user.save();

        // ユーザーが認証された後、秘密鍵を生成
        const newSecretKey = crypto.randomBytes(32).toString('hex');

        // 既に秘密鍵が存在するか確認
        let secret = await SecretKey.findOne();
        if (secret) {
            return res.status(400).json({ message: "秘密鍵は既に存在します" });
        }

        // 秘密鍵をMongoDBに格納
        const secretData = new SecretKey({ key: newSecretKey });
        await secretData.save();

        res.status(200).json({ message: "メールアドレスが確認され、秘密鍵が生成されました" });
    } catch (err) {
        res.status(500).json(err);
    }
});

async function sendConfirmationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",  // ここを使用しているメールサービスに変更してください
        auth: {
            user: "iput.kernel@gmail.com",
            pass: process.env.MAILPASS
        }
    });

    const link = `https://www.iput-kernel.com/api/auth/confirm-email/${token}`;

    const mailOptions = {
        from: "iput-kernel@gmail.com",
        to: email,
        subject: "アカウント登録",
        text: "このリンクをクリックすれば有効化されるよ: " + link
    };

    await transporter.sendMail(mailOptions);
}

async function signJWT(payload) {
    const latestKeyDoc = await SecretKey.findOne().sort({createdAt: -1});
    const secret = latestKeyDoc.secretKey;

    return jwt.sign(payload, secret);
}

async function verifyJWT(token) {
    const latestKeyDoc = await SecretKey.findOne().sort({createdAt: -1});
    const secret = latestKeyDoc.secretKey;

    return jwt.verify(token, secret);
}

module.exports = router;