"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwtAuth_1 = require("../jwtAuth");
const Class_1 = __importDefault(require("../models/Class"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.get("/:id", async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id)
            .populate([{
                path: 'followings',
                model: 'User',
            }])
            .populate([{
                path: 'followers',
                model: 'User',
            }])
            .populate({
            path: 'classId',
            model: 'Class',
        });
        const userObject = user.toObject();
        const { password, ...other } = userObject;
        res.status(http_status_1.default.OK).json(other);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(http_status_1.default.OK).json("アカウントが更新されました");
        }
        catch (err) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
        }
    }
    else {
        return res.status(http_status_1.default.FORBIDDEN).json("アカウントを更新できません");
    }
});
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User_1.default.findByIdAndDelete(req.params.id);
            res.status(http_status_1.default.OK).json("アカウントが削除されました");
        }
        catch (err) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
        }
    }
    else {
        return res.status(http_status_1.default.FORBIDDEN).json("アカウントを削除できません");
    }
});
//フォロー
router.put("/:id/follow", async (req, res) => {
    //bodyのほうが自分 paramsのほうが相手
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User_1.default.findById(req.params.id);
            const currentUser = await User_1.default.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: { followers: req.body.userId },
                });
                await currentUser.updateOne({
                    $push: { followings: req.params.id },
                });
                res.status(http_status_1.default.OK).json("フォローしました");
            }
            else {
                res.status(http_status_1.default.FORBIDDEN).json("フォロー済みです");
            }
        }
        catch (err) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
        }
    }
    else {
        return res.status(http_status_1.default.FORBIDDEN).json("自分をフォローできません");
    }
});
//フォロー解除
router.put("/:id/unfollow", async (req, res) => {
    //bodyのほうが自分 paramsのほうが相手
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User_1.default.findById(req.params.id);
            const currentUser = await User_1.default.findById(req.body.userId);
            //フォロワーに存在したらフォローを解除できる
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: { followers: req.body.userId },
                });
                await currentUser.updateOne({
                    $pull: { followings: req.params.id },
                });
                res.status(http_status_1.default.OK).json("フォローを解除しました");
            }
            else {
                res.status(http_status_1.default.FORBIDDEN).json("フォローを解除済みです。");
            }
        }
        catch (err) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
        }
    }
    else {
        return res
            .status(http_status_1.default.FORBIDDEN)
            .json("自分をフォロー解除できません");
    }
});
router.put('/joinClass', jwtAuth_1.authenticateJWT, async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const currentUserId = req.user.id; // トークンから取得したユーザーID
        const { classId } = req.body; // リクエストボディからclassIdを取得
        const currentUser = await User_1.default.findById(currentUserId).session(session);
        if (!currentUser) {
            throw new Error('User not found');
        }
        const targetClass = await Class_1.default.findById(classId).session(session);
        if (!targetClass) {
            throw new Error('Class not found');
        }
        // ユーザーをクラスのstudentsIdに追加
        if (!targetClass.studentsId.includes(currentUserId)) {
            targetClass.studentsId.push(currentUserId);
            await targetClass.save({ session });
        }
        // ユーザーのclassフィールドにクラスIDを設定
        currentUser.class = classId;
        await currentUser.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Classmate added successfully' });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
