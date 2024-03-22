import express from 'express';

import cors from 'cors';
import authRoute from './routes/Account/auth';
import classRoute from './routes/Social/class';
import roomRoute from './routes/Cocoon/rooms';
import scheduleRoute from './routes/Timeline/schedule';
import subjectRoute from './routes/subjects';
import teacherRoute from './routes/teachers';
import timetableRoute from './routes/Timeline/timetable';
import userRoute from './routes/Account/users';
import healthRoute from './routes/health';
import lectureRoute from './routes/lecture';

export const app = express();

app.use(express.json());
app.use(cors());
app.use('/v1/health', healthRoute);
app.use('/v1/users', userRoute);
app.use('/v1/auth', authRoute);
app.use('/v1/subject', subjectRoute);
app.use('/v1/lecture',lectureRoute)
app.use('/v1/rooms', roomRoute);
app.use('/v1/teacher', teacherRoute);
app.use('/v1/classes', classRoute);
app.use('/v1/timetable', timetableRoute);
app.use('/v1/schedule', scheduleRoute);
