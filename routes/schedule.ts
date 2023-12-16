import { Router } from "express";
import { createEvents } from 'ics';
import TimeTable from '../models/Timetable';
import Subject , {SubjectType} from '../models/Subject'

const router = Router();

type Event = {
    start: [number, number, number, number, number];
    duration: { hours: number };
    title: string;
};
  
type Events = Event[];

router.get('/schedule', async (req, res) => {
    const timetable = await TimeTable.find().populate({
        path: 'weekSubjects',
        model: 'Subject'
    });
    console.log(timetable);
  
    const events: Events = timetable.reduce((acc: Events, day: any, i: number) => {
        const dayEvents: Events = day.weekSubjects.flatMap((subjects: SubjectType[], j: number) => {
            return subjects.map((subject: SubjectType) => {
                let count = subject.count || 0;
                const timesPerDay = subjects.filter((s: SubjectType) => s.subjectName === subject.subjectName).length;
                const eventsForSubject: Event[] = [];
    
                for (let time = 0; time < timesPerDay; time++) {
                    if (count <= 0) {
                        break;
                    }
    
                    const date = new Date(2022, 0, time * 7 + i + 1);
                    const start: [number, number, number, number, number] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), j + 1, 0];
                    const duration = { hours: 1.5 };
    
                    eventsForSubject.push({
                        start,
                        duration,
                        title: `Class: ${subject.subjectName}`,
                    });
    
                    count--;
                    console.log(`Remaining count for ${subject.subjectName}: ${count}`);
                }
    
                return eventsForSubject;
            });
        }).flat();
    
        return [...acc, ...dayEvents];
    }, []);
  
  console.log(events);
  const { error, value } = createEvents(events);
  
  if (error) {
    console.log(error);
    res.status(500).send('Error generating iCalendar data');
    return;
  }
  
  res.setHeader('Content-Type', 'text/calendar');
  res.send(value);
});

module.exports = router;