"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
//投稿
router.post("/", async (req, res) => {
    const newPost = new Post_1.default(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(http_status_1.default.OK).json(savedPost);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.put("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(http_status_1.default.OK).json("投稿が更新されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("投稿を更新できません");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(http_status_1.default.OK).json("投稿が削除されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("投稿を削除できません");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//特定の投稿の取得
router.get("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id)
            .populate({
            path: 'userId',
            model: 'User',
        });
        return res.status(http_status_1.default.OK).json(post);
    }
    catch (err) {
        return res.status(http_status_1.default.FORBIDDEN).json(err);
    }
});
//いいね
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(http_status_1.default.OK).json("投稿にいいねしました");
        }
        else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                },
            });
            return res.status(http_status_1.default.OK).json("投稿のいいねを取り消しました");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//タイムラインの投稿を取得する。自分の投稿とフォローしている人の投稿を取得する
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User_1.default.findById(req.body.userId)
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
        if (!currentUser) {
            return res
                .status(http_status_1.default.FORBIDDEN)
                .json("ユーザーが存在しません");
        }
        const userPosts = await Post_1.default.find({ userId: currentUser._id })
            .populate({
            path: 'userId',
            model: 'User',
        });
        //自分がフォローしている人の投稿を取得する
        const friendPosts = await Promise.all(currentUser.followings.map((friendId) => {
            return Post_1.default.find({ userId: friendId });
        }));
        return res.status(http_status_1.default.OK).json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
module.exports = router;
