"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ClassSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    department: {
        type: String,
    },
    course: {
        type: String,
    },
    classGrade: {
        type: Number,
    },
    classChar: {
        type: String,
        max: 2,
    },
    studentsId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    timetableId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Timetable",
    },
});
const Class = mongoose_1.default.model("Class", ClassSchema);
exports.default = Class;
