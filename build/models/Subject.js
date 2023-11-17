"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubjectSchema = new mongoose_1.default.Schema({
    subjectName: {
        type: String,
        default: "",
        required: true,
    },
    teachersId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Teacher",
        },
    ],
    reviewsId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    grade: {
        type: Number,
    },
    count: {
        type: Number,
        default: 0,
    },
    isRequire: {
        type: Boolean,
        default: false,
    },
});
const Subject = mongoose_1.default.model("Subject", SubjectSchema);
exports.default = Subject;
