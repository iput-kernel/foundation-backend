import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Schedule from '../models/Schedule';
import Event from '../models/Event';
import TimeTable from '../models/Timetable';
import Subject from '../models/Subject';
import Class from '../models/Class';
import Room from '../models/Room';
import { Router } from 'express';

const scheduleRoute = Router();

export const createScheduleFromTimetable = async (
  req: Request,
  res: Response,
) => {
  try {
    // 18週間以上のスケジュール生成はできない。
    const WEEK_LIMIT = 18;

    const timetableId = req.params.id;

    const classStartTimes: Record<number, { hour: number; minute: number }> = {
      0: { hour: 9, minute: 15 },
      1: { hour: 10, minute: 55 },
      2: { hour: 13, minute: 10 },
      3: { hour: 14, minute: 50 },
      4: { hour: 16, minute: 30 },
      5: { hour: 18, minute: 10 },
      6: { hour: 19, minute: 50 },
    };

    // Timetableを取得
    const timetable = await TimeTable.findById(timetableId);

    if (!timetable) {
      return res.status(404).send('Timetable not found');
    }

    const usedClass = await Class.findById(timetable.usedClass);

    // 新しいスケジュールを作成
    const schedule = new Schedule({
      reference: usedClass?._id,
      onModel: 'Class',
      events: [],
    });

    // 今日の日付を開始日として設定
    const startDate = req.body.startDate
      ? new Date(req.body.startDate)
      : new Date();
    const subjects: Record<
      string,
      { name: string; remain: number; count: number }
    > = {};

    let startDayOfWeek = startDate.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6; // 日曜日を最後に配置

    // timetableに入りきらない範囲だった場合、次の週の月曜日からスタート
    if (startDayOfWeek >= timetable.weekEntries.length) {
      startDate.setDate(startDate.getDate() + (7 - startDayOfWeek));
      startDayOfWeek = 0;
    }

    // Timetableに含まれる科目
    for (let i = 0; i < timetable.weekEntries.length; i++) {
      for (let j = 0; j < timetable.weekEntries[i].length; j++) {
        const weekEntry = timetable.weekEntries[i][j];
        if (!weekEntry || !weekEntry.subject) {
          continue;
        }
        const weekSubjectId = weekEntry.subject.toString();
        const subject = await Subject.findById(weekSubjectId);

        if (subject) {
          subjects[weekSubjectId] = {
            name: subject.subjectName,
            remain: subject.count || 0,
            count: 1,
          };
        }
      }
    }

    // 各曜日のSubjectをイベントとしてScheduleに追加
    for (let week = 0; week < WEEK_LIMIT; week++) {
      // 基本的に月曜日からスタート
      for (let i = startDayOfWeek; i < timetable.weekEntries.length; i++) {
        for (let j = 0; j < timetable.weekEntries[i].length; j++) {
          const weekEntry = timetable.weekEntries[i][j];

          if (!weekEntry || !weekEntry.subject) {
            continue;
          }

          const weekSubjectId = weekEntry.subject.toString();
          const subject = subjects[weekSubjectId];

          if (!subject || subject.remain === undefined || subject.remain <= 0) {
            continue;
          }

          // startDateから時間割をもとにイベントの日付を計算
          const eventStartDate = new Date(startDate);
          eventStartDate.setDate(startDate.getDate() + i - startDayOfWeek); // i日後
          eventStartDate.setHours(
            classStartTimes[j].hour,
            classStartTimes[j].minute,
          ); // 開始時間を設定

          const room = await Room.findById(weekEntry.room);
          const event = new Event({
            name: subject.name,
            startDate: eventStartDate,
            endDate: new Date(eventStartDate.getTime() + 90 * 60000),
            place: room ? room.roomNumber : undefined,
            description: `この講義は ${subject.count} 回目です。.`,
          });
          await event.save();
          schedule.events.push(event._id);

          // Subjectのcountをデクリメント
          if (typeof subject.remain === 'number') {
            subject.remain--;
            subject.count++;
          }
        }
      }

      // 次の週に進む
      startDate.setDate(startDate.getDate() - startDayOfWeek + 7);
      // 月曜からstart
      startDayOfWeek = 0;
    }

    await schedule.save();

    res.status(httpStatus.CREATED).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

scheduleRoute.get('/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('events')
      .populate({
        path: 'reference',
        model: 'Class',
      });

    if (!schedule) {
      return res.status(404).send('Schedule not found');
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

scheduleRoute.post('/create-schedule/:id', createScheduleFromTimetable);

export default scheduleRoute;
