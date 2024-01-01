import httpStatus from "http-status";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";
import Room from "../models/Room";
import { Router, Response } from "express";

const roomRoute = Router();

roomRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const newRoom = new Room(req.body);
      const savedRoom = await newRoom.save();
      res.status(httpStatus.OK).json(savedRoom);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

// roomをすべて取得
roomRoute.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(httpStatus.OK).json(rooms);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//特定のroomを取得
roomRoute.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    return res.status(httpStatus.OK).json(room);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

//特定のroomを更新
roomRoute.put(
  "/number/:number",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 3) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const room = await Room.findOne({ roomNumber: req.params.number });
      if (!room) {
        return res.status(httpStatus.BAD_REQUEST).json("room not found");
      }
      await room.updateOne({
        $set: req.body,
      });
      return res.status(httpStatus.OK).json("roomが更新されました");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(err.message || "Something went wrong");
    }
  },
);

// userが管理者、もしくは信用レベルが4以上の場合にroomを削除
roomRoute.delete(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const room = await Room.findById(req.params.id);
      await room!.deleteOne();
      return res.status(httpStatus.OK).json("roomが削除されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

roomRoute.delete(
  "/number/:number",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const room = await Room.findOne({ roomNumber: req.params.number });
      await room!.deleteOne();
      return res.status(httpStatus.OK).json("roomが削除されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

export default roomRoute;
