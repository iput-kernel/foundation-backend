import httpStatus from 'http-status';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from '../jwtAuth';

const teacherRoute = Router();
const prisma =  new PrismaClient();

// Create a teacher but only admin or has cred-level of 4 or higher
teacherRoute.post('/', 
async (req:RequestWithUser, res) => {
  if (req.user!.credLevel < 4){
    return res
      .status(httpStatus.OK)
      .send('教員を登録する権限がありません。')
  }
  try {
    const newTeacher = await prisma.teacher.create({
      data:{
        name: req.body.name,
      },
    });
    return res
      .status(httpStatus.OK)
      .json(newTeacher)
  } catch (err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('内部エラーが発生しました。');
  }
});
// Get all teachers
teacherRoute.get('/', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.status(httpStatus.OK).json(teachers);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Delete a teacher but only admin or has cred-level of 4 or higher
teacherRoute.delete('/:id', async (req:RequestWithUser, res) => {
  if (req.user!.credLevel < 4) {
    return res
      .status(httpStatus.OK)
      .send('教員を削除する権限がありません。')
  }
  try {
    const deletedTeacher = await prisma.teacher.delete({
      where: {
        id: req.params.id,
      },
    })
    return res
      .status(httpStatus.OK)
      .json(deletedTeacher)
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default teacherRoute;
