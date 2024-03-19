import httpStatus from 'http-status';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser, authenticateJWT } from '../jwtAuth';

const subjectRoute = Router();
const prisma = new PrismaClient();

// Subject作成
subjectRoute.post('/',
  authenticateJWT,
  async (req:RequestWithUser, res) => {
    if (req.user!.credLevel < 3){
      return res
        .status(httpStatus.FORBIDDEN)
        .send('科目を追加する権限がありません。')
    }
    try {
      const newSubject = await prisma.subject.create({
        data:{
          name: req.body.name,
        }
      })
      return res
        .status(httpStatus.OK)
        .json(newSubject)
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
});

// Subject更新
subjectRoute.put('/:id', async (req, res) => {
  try {
    const subject = await prisma.subject.update({
      where: {
        id: req.params.id
      },
      data: {
        timetableId: req.body.timetableId,
      },
    })
    return res.status(httpStatus.OK).json(subject);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Subject削除
subjectRoute.delete('/:id',
  async (req:RequestWithUser, res) => {
    try {
      if (req.user!.credLevel < 4){
        return res
          .status(httpStatus.FORBIDDEN)
          .send('科目を削除する権限がありません。')
      }
      const deletedSubject = await prisma.subject.delete({
        where: {
          id: req.params.id,
        },
      })
      return res
        .status(httpStatus.OK)
        .json(deletedSubject);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

// 全てのSubject取得
subjectRoute.get('/', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default subjectRoute;
