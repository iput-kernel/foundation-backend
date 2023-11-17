"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ElevatorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        default: "",
    },
    color: {
        type: String,
        default: "",
    },
    stops: {
        type: [Number],
        default: [],
    },
});
const Elevator = mongoose_1.default.model("Elevator", ElevatorSchema);
exports.default = Elevator;
