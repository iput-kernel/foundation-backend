const httpStatus = require("http-status");

const router = require("express").Router();
const Elevator = require("../models/Elevator");
const User = require("../models/User");

// Create Elevator
router.post("/", async (req, res) => {
  const newElevator = new Elevator(req.body);
  try {
    const savedElevator = await newElevator.save();
    res.status(httpStatus.OK).json(savedElevator);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Update Elevator by color
router.put("/:color", async (req, res) => {
  try {
    const elevator = await Elevator.findOne({ color: req.params.color });
    if (elevator.color === req.body.color) {
      await elevator.updateOne({
        $set: req.body,
      });
      return res.status(httpStatus.OK).json("エレベーターが更新されました");
    } else {
      return res
        .status(httpStatus.FORBIDDEN)
        .json("エレベーターを更新できません");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Delete Elevator by id
router.delete("/:id", async (req, res) => {
  try {
    const elevator = await Elevator.findById(req.params.id);
    await elevator.deleteOne();
    return res.status(httpStatus.OK).json("エレベーターが削除されました");
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

module.exports = router;
