import httpStatus from 'http-status';
import Class from '../../models/Social/Class';
import User from '../../models/Account/User';
import { Router } from 'express';
import { authenticateJWT, RequestWithUser } from '../../jwtAuth';
import { PrismaClient } from '@prisma/client';

const classRoute = Router();
const prisma = new PrismaClient();

//クラス
classRoute.post('/',
  authenticateJWT,
  async (req:RequestWithUser, res) => {
  if (!req.user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send('アカウントが認証されていません。');
  }
  if (req.user.credLevel < 4) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send('クラスを作成する権限がありません。');
  }
  try{
    const newClass = prisma.class.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(httpStatus.OK).json(newClass);
  }catch(err){
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

classRoute.put('/:id', 
  authenticateJWT,
  async (req:RequestWithUser, res) => {
    if (!req.user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send('アカウントが認証されていません。');
    }

    if (req.user.credLevel < 3) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send('クラスを編集する権限がありません。');
    }

    try {
      const post = await Class.findById(req.params.id);
      if (post!.userId! === req.body.userId) {
        await post!.updateOne({
          $set: req.body,
        });
        return res.status(httpStatus.OK).json('クラスが更新されました');
      } else {
        return res.status(httpStatus.FORBIDDEN).json('クラスを更新できません');
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

classRoute.delete('/:id', async (req, res) => {
  try {
    const post = await Class.findById(req.params.id);
    const user = await User.findById(req.body.userId).populate({
      path: 'auth',
      model: 'Auth',
    });
    if (user!.auth.credLevel > 5) {
      await post!.deleteOne();
      return res.status(httpStatus.OK).json('クラスが削除されました');
    } else {
      return res.status(httpStatus.FORBIDDEN).json('クラスを削除できません');
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//特定のクラスの取得
classRoute.get('/:id', async (req, res) => {
  try {
    const classes = await prisma.class.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        students: true,
        subject: true,
      },
    });
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

// クラスをすべて取得
classRoute.get('/', async (req, res) => {
  try {
    const classes = await prisma.class.findMany();
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default classRoute;
