const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function verifyJWT(user, token) {
    const secret = user.secretKey;
    if (!secret) {
        throw new Error("No secret key found for the given user.");
    }
    return jwt.verify(token, secret);
}

const authenticateJWT = async (req, res, next) => {
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
        req.user = decoded;  // トークンのペイロードをリクエストオブジェクトに追加
        next();
    } catch (err) {
        return res.status(403).json({ message: "無効なトークン" });
    }
};

module.exports = {
    authenticateJWT
};