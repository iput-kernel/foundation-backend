import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import { RequestWithUser, authenticateJWT } from '../../jwtAuth';

const extraSubjectRoute = Router()
const prisma = new PrismaClient()

//クラス
extraSubjectRoute.post(
  '/',
  authenticateJWT,
  async (req: RequestWithUser , res) => {
    if(req.user!.credLevel<3){
      return res
        .status(httpStatus.FORBIDDEN)
        .send('例外科目を作成する権限がありません');
    }
    try{
      const newExtraSubject = await prisma.extraSubject.create({
        data:{
          name: req.body.name,
          roomNumber: req.body.roomNumber,
          timetableId: req.body.timetableId
        }
      })

      return res.status(httpStatus.OK).json(newExtraSubject)
    }catch(err){
      console.log(err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('内部エラーが発生しました。')
    }
});

extraSubjectRoute.delete(
  '/:id',
  authenticateJWT,
  async ( req: RequestWithUser , res ) => {

  if (req.user!.credLevel<4){
    return res
      .status(httpStatus.FORBIDDEN)
      .send('例外科目を削除する権限がありません。')
  }
  try {
    prisma.extraSubject.delete({
      where:{
        id: req.body.id
      }
    })
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('内部エラーが発生しました。');
  }
});

//特定のクラスの取得
extraSubjectRoute.get('/:id', async (req, res) => {
  try {
    const extraSubject = await prisma.extraSubject.findUnique({
      where: {
        id: req.params.id
      },
    });
    return res.status(httpStatus.OK).json(extraSubject);
  } catch (err) {
    console.log(err)
    return res.status(httpStatus.FORBIDDEN).send('内部エラーが発生しました。');
  }
});

// クラスをすべて取得
extraSubjectRoute.get('/', async (req, res) => {
  try {
    const extraSubjects = await prisma.extraSubject.findMany()
    return res.status(httpStatus.OK).json(extraSubjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default extraSubjectRoute;
