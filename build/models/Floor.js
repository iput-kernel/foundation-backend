"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FloorSchema = new mongoose_1.default.Schema({
    floor: {
        type: Number,
        required: true,
    },
    roomsId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],
});
const Floor = mongoose_1.default.model("Floor", FloorSchema);
exports.default = Floor;
