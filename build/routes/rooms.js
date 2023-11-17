"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const jwtAuth_1 = require("../jwtAuth");
const Room_1 = __importDefault(require("../models/Room"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.post("/", jwtAuth_1.authenticateJWT, async (req, res) => {
    try {
        const newRoom = new Room_1.default(req.body);
        const user = await User_1.default.findById(req.body.userId);
        if (user.isAdmin || user.credLevel >= 4) {
            const savedRoom = await newRoom.save();
            res.status(http_status_1.default.OK).json(savedRoom);
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("権限がありません。");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//roomをすべて取得
router.get("/", async (req, res) => {
    try {
        const rooms = await Room_1.default.find();
        res.status(http_status_1.default.OK).json(rooms);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
//特定のroomを取得
router.get("/:id", async (req, res) => {
    try {
        const room = await Room_1.default.findById(req.params.id);
        return res.status(http_status_1.default.OK).json(room);
    }
    catch (err) {
        return res.status(http_status_1.default.FORBIDDEN).json(err);
    }
});
//特定のroomを更新
router.put("/number/:number", jwtAuth_1.authenticateJWT, async (req, res) => {
    try {
        const room = await Room_1.default.findOne({ roomNumber: req.params.number });
        if (!room) {
            return res.status(404).json("room not found");
        }
        await room.updateOne({
            $set: req.body,
        });
        return res.status(http_status_1.default.OK).json("roomが更新されました");
    }
    catch (err) {
        return res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json(err.message || "Something went wrong");
    }
});
// userが管理者、もしくは信用レベルが4以上の場合にroomを削除
router.delete("/:id", jwtAuth_1.authenticateJWT, async (req, res) => {
    try {
        const room = await Room_1.default.findById(req.params.id);
        const user = await User_1.default.findById(req.body.userId);
        if (user.isAdmin || user.credLevel >= 4) {
            await room.deleteOne();
            return res.status(http_status_1.default.OK).json("roomが削除されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("権限がありません。");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
router.delete("/number/:number", jwtAuth_1.authenticateJWT, async (req, res) => {
    try {
        const room = await Room_1.default.findOne({ roomNumber: req.params.number });
        const user = await User_1.default.findById(req.body.userId);
        if (user.isAdmin || user.credLevel >= 4) {
            await room.deleteOne();
            return res.status(http_status_1.default.OK).json("roomが削除されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("権限がありません。");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
module.exports = router;
