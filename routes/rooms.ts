import { Router } from "express";
import httpStatus from "http-status";
import { authenticateJWT } from "../jwtAuth";
import Room from "../models/Room";
import User from "../models/User";

const router = Router();

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const user = await User.findById(req.body.userId);
    if (user!.isAdmin || user!.credLevel >= 4) {
      const savedRoom = await newRoom.save();
      res.status(httpStatus.OK).json(savedRoom);
    } else {
      return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// roomをすべて取得
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(httpStatus.OK).json(rooms);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//特定のroomを取得
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    return res.status(httpStatus.OK).json(room);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

//特定のroomを更新
router.put("/number/:number", authenticateJWT, async (req, res) => {
  try {
    const room = await Room.findOne({ roomNumber: req.params.number });
    if (!room) {
      return res.status(404).json("room not found");
    }
    await room.updateOne({
      $set: req.body,
    });
    return res.status(httpStatus.OK).json("roomが更新されました");
  } catch (err: any) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(err.message || "Something went wrong");
  }
});

// userが管理者、もしくは信用レベルが4以上の場合にroomを削除
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (user!.isAdmin || user!.credLevel >= 4) {
      await room!.deleteOne();
      return res.status(httpStatus.OK).json("roomが削除されました");
    } else {
      return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

router.delete("/number/:number", authenticateJWT, async (req, res) => {
  try {
    const room = await Room.findOne({ roomNumber: req.params.number });
    const user = await User.findById(req.body.userId);
    if (user!.isAdmin || user!.credLevel >= 4) {
      await room!.deleteOne();
      return res.status(httpStatus.OK).json("roomが削除されました");
    } else {
      return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

module.exports = router;
