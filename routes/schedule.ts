import { Router, Request, Response } from "express";
import Schedule from '../models/Schedule';
import Event from '../models/Event';
import TimeTable from '../models/Timetable';
import Subject from '../models/Subject';
import Class ,{ ClassType } from '../models/Class';

const router = Router();

export const createScheduleFromTimetable = async (req: Request, res: Response) => {
  
  // 18週間以上のスケジュール生成はできない。
  const WEEK_LIMIT = 18;

  const timetableId = req.params.id;

  const classStartTimes: Record<number, { hour: number, minute: number }> = {
    0: { hour: 9, minute: 15 },
    1: { hour: 10, minute: 55 },
    2: { hour: 13, minute: 10 },
    3: { hour: 14, minute: 50 },
    4: { hour: 16, minute: 30 },
    5: { hour: 18, minute: 10 },
    6: { hour: 19, minute: 50 },
  };

  // Timetableを取得
  const timetable = await TimeTable.findById(timetableId)
  .populate({
      path: 'weekSubjects',
      model: 'Subject'
  });

  
  if (!timetable) {
    return res.status(404).send('Timetable not found');
  }

  const usedClass = (await Class.findById(timetable.usedClass))
  console.log(usedClass)
  
  // 新しいスケジュールを作成
  const schedule = new Schedule({
    name: `${(usedClass?.classGrade?.toString()+ "年" + usedClass?.course + usedClass?.classChar)}のスケジュール`,
    events: [],
  });
  
  // 今日の日付を開始日として設定
  let startDate = new Date();
  const subjects: Record<string, { name: string, count: number }> = {};


  let startDayOfWeek = startDate.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6; // 日曜日を最後に配置

    // timetableに入りきらない範囲だった場合、次の週の月曜日からスタート
    if (startDayOfWeek >= timetable.weekSubjects.length) {
        startDate.setDate(startDate.getDate() + (7 - startDayOfWeek));
        startDayOfWeek = 0; 
    }
  
  // Timetableに含まれる科目
  for (let i = 0; i < timetable.weekSubjects.length; i++) {
    for (let j = 0; j < timetable.weekSubjects[i].length; j++) {
      const weekSubjectId = timetable.weekSubjects[i][j];
      const subject = await Subject.findById(weekSubjectId);
      if (subject) {
        subjects[weekSubjectId.toString()] = {
            name: subject.subjectName,
            count: subject.count || 0,
        };
      }
    }
  }

  // 各曜日のSubjectをイベントとしてScheduleに追加
  for (let week = 0; week < WEEK_LIMIT; week++) {
    // 基本的に月曜日からスタート
    for (let i = startDayOfWeek; i < timetable.weekSubjects.length; i++) {
      for (let j = 0; j < timetable.weekSubjects[i].length; j++) {
        const weekSubjectId = timetable.weekSubjects[i][j].toString();
        const subject = subjects[weekSubjectId];

        if (!subject || subject.count === undefined || subject.count <= 0) {
            continue;
        }

        // startDateから時間割をもとにイベントの日付を計算
        const eventStartDate = new Date(startDate);
        eventStartDate.setDate(startDate.getDate() + i); // i日後
        eventStartDate.setHours(classStartTimes[j].hour, classStartTimes[j].minute); // 開始時間を設定

        // Subjectからイベントを作成
        const event = new Event({
          name: subject.name,
          startDate: eventStartDate, // 計算した日付を使用
          endDate: new Date(eventStartDate.getTime() + 90 * 60000), // durationを固定の90分とする
          description: `この講義は ${subject.count} 回目です。.`,
        });
        await event.save();
        schedule.events.push(event._id);

        // Subjectのcountをデクリメント
        if (typeof subject.count === 'number') {
            subject.count--;
        }
      }
    }
  
    // 次の週に進む
    startDate.setDate(startDate.getDate() + 7);
    // 月曜からstart
    startDayOfWeek = 0;
  }
  
  await schedule.save();
  
  res.status(201).json(schedule);
};

router.get('/create-schedule/:id', createScheduleFromTimetable);

module.exports = router;