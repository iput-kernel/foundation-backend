import httpStatus from "http-status";
import mongoose from "mongoose";
import { authenticateJWT, RequestWithUser } from "../jwtAuth";
import Class from "../models/Class";
import User from "../models/Account/User";
import { Router, Response } from "express";

const userRoute = Router();

userRoute.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate([
        {
          path: "followings",
          model: "User",
        },
      ])
      .populate([
        {
          path: "followers",
          model: "User",
        },
      ])
      .populate({
        path: "class",
        model: "Class",
      })
      .populate({
        path: "profile",
        model: "Profile",
      });

    const userObject = user!.toObject();
    // eslint-disable-next-line
    const { password, auth, isVerified, ...other } = userObject;
    res.status(httpStatus.OK).json(other);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

userRoute.put(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.body.userId !== req.params.id) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      // eslint-disable-next-line
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(httpStatus.OK).json("アカウントが更新されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

userRoute.delete(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (!req.user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send("ユーザー認証が必要です。");
      }
      if (req.body.userId !== req.params.id) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      await User.findByIdAndDelete(req.params.id); // eslint-disable-line
      res.status(httpStatus.OK).json("アカウントが削除されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

//フォロー
userRoute.put(
  "/:id/follow",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    //bodyのほうが自分 paramsのほうが相手
    try {
      if (req.body.userId !== req.params.id) {
        return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
      }
      if (req.body.userId === req.params.id) {
        return res
          .status(httpStatus.FORBIDDEN)
          .json("自分をフォローできません");
      }
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user!.followers.includes(req.body.userId)) {
        await user!.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser!.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(httpStatus.OK).json("フォローしました");
      } else {
        res.status(httpStatus.FORBIDDEN).json("フォロー済みです");
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

//フォロー解除
userRoute.put(
  "/:id/unfollow",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    //bodyのほうが自分 paramsのほうが相手
    try {
      if (req.body.userId === req.params.id) {
        return res
          .status(httpStatus.FORBIDDEN)
          .json("自分をフォロー解除できません");
      }
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーに存在したらフォローを解除できる
      if (user!.followers.includes(req.body.userId)) {
        await user!.updateOne({
          $pull: { followers: req.body.userId },
        });
        await currentUser!.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(httpStatus.OK).json("フォローを解除しました");
      } else {
        res.status(httpStatus.FORBIDDEN).json("フォローを解除済みです。");
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

userRoute.put(
  "/joinClass",
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "ユーザーが認証されていません" });
      }
      if (!req.body.classId) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "クラスIDが指定されていません" });
      }

      const { classId } = req.body; // リクエストボディからclassIdを取得
      const currentUserId = req.user.id;
      const currentUser = await User.findById(currentUserId).session(session);

      if (currentUser!.class !== classId) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "権限がありません。" });
      }

      if (!currentUser) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "ユーザーが見つかりません" });
      }

      const targetClass = await Class.findById(classId).session(session);
      if (!targetClass) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "クラスが見つかりません" });
      }

      // ユーザーをクラスのstudentsIdに追加
      if (
        !targetClass.studentsId
          .map((id) => id.toString())
          .includes(currentUserId.toString())
      ) {
        targetClass.studentsId.push(currentUserId);
        await targetClass.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Classmate added successfully" });
      // eslint-disable-next-line
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: error.message });
    }
  }
);

export default userRoute;
