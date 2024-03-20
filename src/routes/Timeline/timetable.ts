import httpStatus from 'http-status';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const timetableRoute = Router();
const prisma = new PrismaClient();

timetableRoute.get('/search', async (req, res) => {
  const { dayOfWeek, period } = req.query;

  try {
    const subjects = await prisma.timetable.findMany({
      where: {
        dayOfWeek: Number(dayOfWeek),
        period: Number(period),
      },
      include: {
        subject: true,
      },
    });

    return res
      .status(httpStatus.OK)
      .json(subjects);
  } catch (error) {
    res.status(500).send('内部エラーが発生しました。');
  }
});


export default timetableRoute;
