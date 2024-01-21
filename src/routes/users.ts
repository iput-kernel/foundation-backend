import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { authenticateJWT, RequestWithUser } from '../jwtAuth';

import Class from '../models/Social/Class';
import User from '../models/Account/User';
import { Router } from 'express';

const userRoute = Router();

userRoute.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate([
        {
          path: 'followings',
          model: 'User',
        },
      ])
      .populate([
        {
          path: 'followers',
          model: 'User',
        },
      ])
      .populate({
        path: 'class',
        model: 'Class',
      })
      .populate({
        path: 'profile',
        model: 'Profile',
      })

    const userObject = user!.toObject();
    const { password, ...other } = userObject; // eslint-disable-line
    res.status(httpStatus.OK).json(other);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

userRoute.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { // eslint-disable-line
        $set: req.body,
      });
      res.status(httpStatus.OK).json('アカウントが更新されました');
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  } else {
    return res.status(httpStatus.FORBIDDEN).json('アカウントを更新できません');
  }
});

userRoute.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id); // eslint-disable-line
      res.status(httpStatus.OK).json('アカウントが削除されました');
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  } else {
    return res.status(httpStatus.FORBIDDEN).json('アカウントを削除できません');
  }
});

//フォロー
userRoute.put('/:id/follow', async (req, res) => {
  //bodyのほうが自分 paramsのほうが相手
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user!.followers.includes(req.body.userId)) {
        await user!.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser!.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(httpStatus.OK).json('フォローしました');
      } else {
        res.status(httpStatus.FORBIDDEN).json('フォロー済みです');
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  } else {
    return res.status(httpStatus.FORBIDDEN).json('自分をフォローできません');
  }
});

//フォロー解除
userRoute.put('/:id/unfollow', async (req, res) => {
  //bodyのほうが自分 paramsのほうが相手
  if (req.body.userId !== req.params.id) {
    try {
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
        res.status(httpStatus.OK).json('フォローを解除しました');
      } else {
        res.status(httpStatus.FORBIDDEN).json('フォローを解除済みです。');
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  } else {
    return res
      .status(httpStatus.FORBIDDEN)
      .json('自分をフォロー解除できません');
  }
});

userRoute.put(
  '/joinClass',
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: 'ユーザーが認証されていません' });
      }

      const { classId } = req.body; // リクエストボディからclassIdを取得

      const currentUserId = req.user.id;
      const currentUser = await User.findById(currentUserId).session(session);

      if (!currentUser) {
        throw new Error('User not found');
      }

      const targetClass = await Class.findById(classId).session(session);
      if (!targetClass) {
        throw new Error('Class not found');
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

      res.status(200).json({ message: 'Classmate added successfully' });
    } catch (error: any) { // eslint-disable-line
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: error.message });
    }
  },
);

userRoute.post(
  '/test/test',
  authenticateJWT,
  async (req:RequestWithUser ,res) => {
    // ユーザーを取得
    const user = await User.findById(req.body.userId)
      .populate({
        path: 'class',
        model: 'Class',
        populate: {
          path: 'timetableId',
          model: 'Timetable',
        },
      })
      .populate({
        path: 'extraClass',
        model: 'ExtraClass',
        populate: {
          path: 'timetableId',
          model: 'Timetable',
        },
      });
  
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'ユーザーが認証されていません' });
    }

    console.log(user);

    return res.status(200).json(user);
  },
);

export default userRoute;
