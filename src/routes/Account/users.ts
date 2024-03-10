import httpStatus from 'http-status';
import { authenticateJWT, RequestWithUser } from '../../jwtAuth';

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const userRoute = Router();
const prisma = new PrismaClient();

userRoute.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        class: true,
        profile: true,
      },
    });

    res.status(httpStatus.OK).json(user);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

userRoute.delete('/:id',authenticateJWT , 
async (req:RequestWithUser, res) => {
  if (!req.user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'ユーザーが認証されていません' });
  }
  if (req.user.id !== req.params.id) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ message: '他のユーザーのアカウントを削除できません' });
  }
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(httpStatus.OK).json('ユーザーが削除されました');
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});


userRoute.put(
  '/joinClass/:classId',
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    if (!req.user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'ユーザーが認証されていません' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const targetClass = await prisma.class.findUnique({
      where: {
        id: req.params.classId,
      },
    });

    if (!user || !targetClass) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'ユーザーまたはクラスが見つかりません' });
    }

    if (user.classId === targetClass.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'ユーザーはすでにそのクラスに参加しています' });
    }
    try{
      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: req.user.id,
          },
          data: {
            class: {
              connect: {
                id: targetClass.id,
              },
            },
          },
        }),
        prisma.class.update({
          where: {
            id: req.params.classId,
          },
          data: {
            students: {
              connect: {
                id: req.user.id,
              },
            },
          },
        }),
      ]);
      res.status(httpStatus.OK).json('クラスに参加しました');
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

export default userRoute;
