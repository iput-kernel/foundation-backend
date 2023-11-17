"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const Elevator_1 = __importDefault(require("../models/Elevator"));
const router = (0, express_1.Router)();
// Create Elevator
router.post("/", async (req, res) => {
    const newElevator = new Elevator_1.default(req.body);
    try {
        const savedElevator = await newElevator.save();
        res.status(http_status_1.default.OK).json(savedElevator);
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Update Elevator by color
router.put("/:color", async (req, res) => {
    try {
        const elevator = await Elevator_1.default.findOne({ color: req.params.color });
        if (elevator.color === req.body.color) {
            await elevator.updateOne({
                $set: req.body,
            });
            return res.status(http_status_1.default.OK).json("エレベーターが更新されました");
        }
        else {
            return res
                .status(http_status_1.default.FORBIDDEN)
                .json("エレベーターを更新できません");
        }
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
// Delete Elevator by id
router.delete("/:id", async (req, res) => {
    try {
        const elevator = await Elevator_1.default.findById(req.params.id);
        await elevator.deleteOne();
        return res.status(http_status_1.default.OK).json("エレベーターが削除されました");
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
});
module.exports = router;
