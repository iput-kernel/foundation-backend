"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const Subject_1 = __importDefault(require("../models/Subject"));
const Timetable_1 = __importDefault(require("../models/Timetable"));
const router = (0, express_1.Router)();
// Create a Timetable
router.post("/", async (req, res) => {
    const { usedClass, weekSubjects } = req.body;
    try {
        const timetableSubjects = await Promise.all(weekSubjects.map(async (daySubjects) => {
            return await Promise.all(daySubjects.map(async (name) => {
                const subject = await Subject_1.default.findOne({ subjectName: name });
                if (!subject) {
                    throw new Error(`${name} という科目は存在しません`);
                }
                return subject._id;
            }));
        }));
        const timetable = new Timetable_1.default({
            usedClass,
            weekSubjects: timetableSubjects,
        });
        await timetable.save();
        res.status(201).json(timetable);
    }
    catch (err) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
});
// Get a Timetable by ID
router.get("/:id", async (req, res) => {
    try {
        const timetable = await Timetable_1.default.findById(req.params.id)
            .populate([{
                path: "weekSubjects",
                model: "Subject",
            }])
            .populate({
            path: "usedClass",
            model: "Class",
        });
        if (!timetable) {
            return res
                .status(404)
                .json({ message: "指定されたIDの時間割は存在しません" });
        }
        res.status(http_status_1.default.OK).json(timetable);
    }
    catch (err) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
});
// Get all Timetables
router.get("/", async (req, res) => {
    try {
        const timetables = await Timetable_1.default.find()
            .populate({
            path: "weekSubjects",
            model: "Subject",
        })
            .populate({
            path: "usedClass",
            model: "Class",
        });
        res.status(http_status_1.default.OK).json(timetables);
    }
    catch (err) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
});
module.exports = router;
