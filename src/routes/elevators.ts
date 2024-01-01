import httpStatus from "http-status";
import Elevator from "../models/Elevator";
import { Router, Response } from "express";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

const elevatorRoute = Router();

// Create Elevator
elevatorRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 5) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const newElevator = new Elevator(req.body);
      const savedElevator = await newElevator.save();
      res.status(httpStatus.OK).json(savedElevator);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

// Update Elevator by color
elevatorRoute.put(
  "/:color",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 5) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const elevator = await Elevator.findOne({ color: req.params.color });
      if (elevator!.color === req.body.color) {
        await elevator!.updateOne({
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
  },
);

// Delete Elevator by id
elevatorRoute.delete(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 5) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const elevator = await Elevator.findById(req.params.id);
      await elevator!.deleteOne();
      return res.status(httpStatus.OK).json("エレベーターが削除されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

export default elevatorRoute;
