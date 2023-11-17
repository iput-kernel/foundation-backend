"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TimetableSchema = new mongoose_1.default.Schema({
    usedClass: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Class",
    },
    weekSubjects: [
        [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
    ],
});
const TimeTable = mongoose_1.default.model("Timetable", TimetableSchema);
exports.default = TimeTable;
