"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const Post_1 = __importDefault(require("../models/Post"));
const Subject_1 = __importDefault(require("../models/Subject"));
const router = (0, express_1.Router)();
//Subject作成
router.post("/", async (req, res) => {
    const newSubject = new Subject_1.default(req.body);
    try {
        const savedSubject = await newSubject.save();
        res.status(http_status_1.default.OK).json(savedSubject);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//Subject更新
router.put("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        await post.updateOne({
            $set: req.body,
        });
        return res.status(http_status_1.default.OK).json("Subjectを編集しました。");
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//Subject削除
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        await post.deleteOne();
        return res.status(http_status_1.default.OK).json("Subjectを削除しました。");
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Subjectを削除 subjectNameで
router.delete("/name/:subjectName", async (req, res) => {
    try {
        const subject = await Subject_1.default.findOne({
            subjectName: req.params.subjectName,
        });
        await subject.deleteOne();
        return res.status(http_status_1.default.OK).json("Subjectを削除しました。");
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//全てのSubject取得
router.get("/", async (req, res) => {
    try {
        const subjects = await Subject_1.default.find()
            .populate([{
                path: 'teacherId',
                model: 'Teacher',
            }])
            .populate([{
                path: 'reviewId',
                model: 'Review',
            }]);
        return res.status(http_status_1.default.OK).json(subjects);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//任意のgradeのSubject取得
router.get("/grade/:grade", async (req, res) => {
    try {
        const subjects = await Subject_1.default.find({ grade: req.params.grade })
            .populate([{
                path: 'teacherId',
                model: 'Teacher',
            }])
            .populate([{
                path: 'reviewId',
                model: 'Review',
            }]);
        return res.status(http_status_1.default.OK).json(subjects);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
module.exports = router;
