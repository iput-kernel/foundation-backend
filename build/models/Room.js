"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    roomName: {
        type: String,
        default: "教室",
    },
    roomNumber: {
        type: Number,
    },
    airId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Air",
    },
    status: {
        type: String,
        default: "",
    },
});
const Room = mongoose_1.default.model("Room", RoomSchema);
exports.default = Room;
