import httpStatus from 'http-status';
import Subject from '../models/Subject';
import Timetable from '../models/Timeline/Timetable';
import Room from '../models/Cocoon/Room';
import { Router } from 'express';

const timetableRoute = Router();

// Create a Timetable
timetableRoute.post(
  '/',
   async (req, res) => {
    const { usedClass, weekEntries } = req.body;

    try {
      const timetableEntries = await Promise.all(
        weekEntries.map(
          async (
            dayEntries: { 
              subject: string | null;
              room: string | null 
            }[],
          ) => {
            return await Promise.all(
              dayEntries.map(
                async ({ subject: subjectId, room: roomId }) => {
                  let subject = null;
                  let room = null;

                  if (subjectId) {
                    subject = await Subject.findById(subjectId);
                    if (!subject) {
                      throw new Error(`${subjectId} という科目は存在しません`);
                    }
                  }

                  if (roomId) {
                    room = await Room.findById(roomId);
                    if (!room) {
                      throw new Error(`${roomId} という教室は存在しません`);
                    }
                  }

                  return { subject: subjectId, room: roomId };
                },
              ),
            );
          },
        ),
      );

      const timetable = new Timetable({
        usedClass,
        weekEntries: timetableEntries,
      });
      await timetable.save();
      res.status(201).json(timetable);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '未知のエラーが発生しました' });
      }
    }
  }
);

// Get a Timetable by ID
timetableRoute.get('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate([
        {
          path: 'weekEntries.subject',
          model: 'Subject',
        },
        {
          path: 'weekEntries.room',
          model: 'Room',
        },
      ])
      .populate({
        path: 'usedClass',
        model: 'Class',
      });
    if (!timetable) {
      return res
        .status(404)
        .json({ message: '指定されたIDの時間割は存在しません' });
    }
    res.status(httpStatus.OK).json(timetable);
  } catch (err: unknown) { 
    if (err instanceof Error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '未知のエラーが発生しました' });
      console.log(err)
    }
  }
});

// Get all Timetables
timetableRoute.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate({
        path: 'usedClass',
        model: 'Class',
      })
      .populate([
        {
          path: 'weekEntries.subject',
          model: 'Subject',
        },
        {
          path: 'weekEntries.room',
          model: 'Room',
        },
      ]);
    res.status(httpStatus.OK).json(timetables);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '未知のエラーが発生しました' });
    }
  }
});

export default timetableRoute;
