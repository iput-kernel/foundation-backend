import express from 'express';

import cors from 'cors';
import authRoute from './routes/Account/auth';
import classRoute from './routes/Social/classes';
import extraClassRoute from './routes/Social/extraClasses';
import eventRoute from './routes/Timeline/event';
import postRoute from './routes/Content/posts';
import roomRoute from './routes/Cocoon/rooms';
import scheduleRoute from './routes/Timeline/schedule';
import subjectRoute from './routes/subjects';
import teacherRoute from './routes/teachers';
import timetableRoute from './routes/Timeline/timetable';
import userRoute from './routes/Account/users';
import healthRoute from './routes/health';

export const app = express();

app.use(express.json());
app.use(cors());
app.use('/v1/health', healthRoute);
app.use('/v1/users', userRoute);
app.use('/v1/auth', authRoute);
app.use('/v1/posts', postRoute);
app.use('/v1/subjects', subjectRoute);
app.use('/v1/rooms', roomRoute);
app.use('/v1/teachers', teacherRoute);
app.use('/v1/classes', classRoute);
app.use('/v1/extra-classes', extraClassRoute);
app.use('/v1/timetable', timetableRoute);
app.use('/v1/schedule', scheduleRoute);
app.use('/v1/event', eventRoute);
