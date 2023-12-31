import httpStatus from "http-status";
import Class from "../models/Class";
import User from "../models/Account/User";
import { Request, Response, Router } from "express";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

const classRoute = Router();

//クラス
classRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 3) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const newClass = new Class(req.body);
      const savedClass = await newClass.save();
      res.status(httpStatus.OK).json(savedClass);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

classRoute.put(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 3 || req.user!.classId != req.params.id) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const post = await Class.findById(req.params.id);
      if (post!.userId! === req.body.userId) {
        await post!.updateOne({
          $set: req.body,
        });
        return res.status(httpStatus.OK).json("クラスが更新されました");
      } else {
        return res.status(httpStatus.FORBIDDEN).json("クラスを更新できません");
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

classRoute.delete(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 3 || req.user!.classId != req.params.id) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const post = await Class.findById(req.params.id);
      const user = await User.findById(req.body.userId).populate({
        path: "auth",
        model: "Auth",
      });
      if (user!.auth.credLevel > 5) {
        await post!.deleteOne();
        return res.status(httpStatus.OK).json("クラスが削除されました");
      } else {
        return res.status(httpStatus.FORBIDDEN).json("クラスを削除できません");
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

//特定のクラスの取得
classRoute.get("/:id", async (req, res) => {
  try {
    const classes = await Class.findById(req.params.id)
      .populate([
        {
          path: "studentsId",
          model: "User",
        },
      ])
      .populate([
        {
          path: "timetableId",
          model: "Timetable",
        },
      ]);
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

// クラスをすべて取得
classRoute.get("/", async (req: Request, res: Response) => {
  try {
    const classes = await Class.find();
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default classRoute;
