import { Response, Router } from "express";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";
import Event from "../models/Event";
import httpStatus from "http-status";

const eventRoute = Router();

eventRoute.put(
  "/trust/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (!req.user)
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send("アカウントが認証されていません。");

      const event = await Event.findById(req.params.id);
      if (!event)
        return res.status(httpStatus.NOT_FOUND).send("Event not found");

      const trustIndex = event.trust.indexOf(req.user.id);
      if (trustIndex > -1) {
        event.trust.splice(trustIndex, 1);
      } else {
        // そうでなければ、trustに追加
        event.trust.push(req.user.id);

        // distrustに存在する場合、それを削除
        const distrustIndex = event.distrust.indexOf(req.user.id);
        if (distrustIndex > -1) {
          event.distrust.splice(distrustIndex, 1);
        }

        switch (true) {
          case req.user.credLevel <= 2:
            event.authenticity = Math.min(event.authenticity + 10, 100);
            break;
          case req.user.credLevel == 3:
            event.authenticity = Math.min(event.authenticity + 30, 100);
            break;
          default:
            event.authenticity = 100;
        }
      }

      await event.save();

      res.send("Trust added successfully");
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Server error");
    }
  },
);

eventRoute.put(
  "/distrust/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (!req.user)
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send("アカウントが認証されていません。");

      const event = await Event.findById(req.params.id);
      if (!event)
        return res.status(httpStatus.NOT_FOUND).send("Event not found");

      // すでにdistrustに同じidが存在する場合、そのdistrustをキャンセル
      const distrustIndex = event.distrust.indexOf(req.user.id);
      if (distrustIndex > -1) {
        event.distrust.splice(distrustIndex, 1);
      } else {
        // そうでなければ、distrustに追加
        event.distrust.push(req.user.id);

        // trustに存在する場合、それを削除
        const trustIndex = event.trust.indexOf(req.user.id);
        if (trustIndex > -1) {
          event.trust.splice(trustIndex, 1);
        }

        switch (true) {
          case req.user.credLevel <= 2:
            event.authenticity = Math.max(event.authenticity - 10, 0);
            break;
          case req.user.credLevel == 3:
            event.authenticity = Math.max(event.authenticity - 30, 0);
            break;
          default:
            event.authenticity = 0;
        }
      }

      await event.save();

      res.send("Distrust added successfully");
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Server error");
    }
  },
);

export default eventRoute;
