"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// Create a teacher but only admin or has cred-level of 4 or higher
router.post("/", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User_1.default.findById(userId);
        if (user.isAdmin || user.trustLevel >= 4) {
            const newTeacher = new Teacher_1.default(req.body);
            try {
                const savedTeacher = await newTeacher.save();
                res.status(http_status_1.default.OK).json(savedTeacher);
            }
            catch (err) {
                return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
            }
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("権限がありません。");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Get all teachers
router.get("/", async (req, res) => {
    try {
        const teachers = await Teacher_1.default.find();
        res.status(http_status_1.default.OK).json(teachers);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Get a teacher by id
router.get("/course/:course", async (req, res) => {
    try {
        const teachers = await Teacher_1.default.find({ course: req.params.course });
        res.status(http_status_1.default.OK).json(teachers);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Update a teacher but only admin or has cred-level of 4 or higher
router.put("/:id", async (req, res) => {
    try {
        const teacher = await Teacher_1.default.findById(req.params.id);
        const user = await User_1.default.findById(req.body.userId);
        if (user.isAdmin || user.trustLevel >= 4) {
            await teacher.updateOne({
                $set: req.body,
            });
            return res.status(http_status_1.default.OK).json("teacherが更新されました");
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json("権限がありません。");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Delete a teacher but only admin or has cred-level of 4 or higher
router.delete("/:id", async (req, res) => {
    try {
        const teacher = await Teacher_1.default.findById(req.params.id);
        const user = await User_1.default.findById(req.body.userId);
        if (user.isAdmin || user.trustLevel >= 4) {
            await teacher.deleteOne();
            return res.status(http_status_1.default.OK).json("teacherが削除されました");
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
