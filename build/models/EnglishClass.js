"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EnglishClassSchema = new mongoose_1.default.Schema({
    classGrade: {
        type: Number,
        required: true,
    },
    classChar: {
        type: String,
    },
    studentsId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    teachersId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Teacher",
        },
    ],
    TimetableId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Timetable",
        },
    ],
});
const EnglishClass = mongoose_1.default.model("EnglishClass", EnglishClassSchema);
exports.default = EnglishClass;
