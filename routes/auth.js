const router = require('express').Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // 新しいユーザーを作成する前に、一時的なトークンを生成
        const token = crypto.randomBytes(16).toString("hex");

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,  // ハッシュ化されたパスワードを保存
            confirmationToken: token,
            isVerified: false
        });

        // メールを送信
        await sendConfirmationEmail(req.body.email, token);

        const user = await newUser.save();
        return res.status(200).json({ message: "Confirmation email sent", user: user._id });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne( {email: req.body.email});
        if(!user) return res.status(400).send("ユーザーが見つかりません");

        const vailedPassword = req.body.password === user.password;
        if(!vailedPassword) return res.status(400).json("パスワードが違います");
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    };
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

        res.status(200).json({ message: "Email認証済み" });
    } catch (err) {
        res.status(500).json(err);
    }
});


async function sendConfirmationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",  // ここを使用しているメールサービスに変更してください
        auth: {
            user: "iput.kernel@gmail.com",
            pass: "$K6nmsYSNK&_AD%"
        }
    });

    const link = `/api/auth/confirm-email/${token}`;

    const mailOptions = {
        from: "iput-kernel@gmail.com",
        to: email,
        subject: "アカウント登録",
        text: "このリンクをクリックすれば有効化されるよ: " + link
    };

    await transporter.sendMail(mailOptions);
}

module.exports = router;