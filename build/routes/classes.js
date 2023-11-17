"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const Class_1 = __importDefault(require("../models/Class"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
//クラス
router.post("/", async (req, res) => {
    const newClass = new Class_1.default(req.body);
    try {
        const savedClass = await newClass.save();
        res.status(http_status_1.default.OK).json(savedClass);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.put("/:id", async (req, res) => {
    try {
        const post = await Class_1.default.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(http_status_1.default.OK).json("クラスが更新されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("クラスを更新できません");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const post = await Class_1.default.findById(req.params.id);
        const user = await User_1.default.findById(req.body.userId);
        if (user.isAdmin || user.credLevel > 5) {
            await post.deleteOne();
            return res.status(http_status_1.default.OK).json("クラスが削除されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("クラスを削除できません");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//特定のクラスの取得
router.get("/:id", async (req, res) => {
    try {
        const classes = await Class_1.default.findById(req.params.id)
            .populate([{
                path: 'studentsId',
                model: 'User',
            }])
            .populate([{
                path: 'timetableId',
                model: 'Timetable',
            }]);
        return res.status(http_status_1.default.OK).json(classes);
    }
    catch (err) {
        return res.status(http_status_1.default.FORBIDDEN).json(err);
    }
});
//クラスをすべて取得
router.get("/", async (req, res) => {
    try {
        const classes = await Class_1.default.find();
        return res.status(http_status_1.default.OK).json(classes);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
module.exports = router;
