import httpStatus from 'http-status';
import Post from '../models/Content/Post';
import Subject from '../models/Subject';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const subjectRoute = Router();
const prisma = new PrismaClient();

// Subject作成
subjectRoute.post('/', async (req, res) => {
  
  try {
    const newSubject = await prisma.subject.create({
      data:{
        classId: req.body.classId,
        name   : req.body.name,
      }
    })
    return res.status(httpStatus.OK).json(newSubject)
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
subjectRoute.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post!.deleteOne();
    return res.status(httpStatus.OK).json('Subjectを削除しました。');
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Subjectを削除 subjectNameで
subjectRoute.delete('/name/:subjectName', async (req, res) => {
  try {
    const subject = await Subject.findOne({
      subjectName: req.params.subjectName,
    });
    await subject!.deleteOne();
    return res.status(httpStatus.OK).json('Subjectを削除しました。');
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// 全てのSubject取得
subjectRoute.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// 任意のgradeのSubject取得
subjectRoute.get('/grade/:grade', async (req, res) => {
  try {
    const subjects = await Subject.find({ grade: req.params.grade })
      .populate([
        {
          path: 'teacherId',
          model: 'Teacher',
        },
      ])
      .populate([
        {
          path: 'reviewId',
          model: 'Review',
        },
      ]);
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default subjectRoute;
