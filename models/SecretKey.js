const mongoose = require('mongoose');

const SecretKeySchema = new mongoose.Schema({
    secretKey: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d'  // 7日後にこのドキュメントを自動的に削除する設定
    }
});

module.exports = mongoose.model('SecretKey', SecretKeySchema);
