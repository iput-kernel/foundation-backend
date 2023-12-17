import { createEvents } from 'ics';
import TimeTable from './models/Timetable';

async function generateICal() {
  const timetable = await TimeTable.find(); // あなたのデータ取得方法に合わせて変更してください

  const events = timetable.map((day, i) => {
    return day.weekSubjects.map((subject, j) => {

      const start = [2022, 1, i+1, j+1, 0]; // 年、月、日、時間、分
      const duration = { hours: 1 };

      return {
        start,
        duration,
        title: `Class: ${subject}`, // ここで授業の名前を設定します
      };
    });
  }).flat();

  const { error, value } = createEvents(events);

  if (error) {
    console.log(error);
    return;
  }

  return value;
}

generateICal().then((value) => {
  console.log(value); // ここでiCalendar形式のデータが出力されます
});