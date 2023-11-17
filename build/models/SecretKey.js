"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SecretKeySchema = new mongoose_1.default.Schema({
    secretKey: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d", // 7日後にこのドキュメントを自動的に削除する設定
    },
});
const SecretKey = mongoose_1.default.model("SecretKey", SecretKeySchema);
exports.default = SecretKey;
