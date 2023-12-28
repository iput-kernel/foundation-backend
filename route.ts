import express, { Router as ExpressRouter } from "express";

import cors from "cors";
import authRoute from "./routes/auth";
import classRoute from "./routes/classes";
import eventRoute from "./routes/event";
import postRoute from "./routes/posts";
import roomRoute from "./routes/rooms";
import scheduleRoute from "./routes/schedule";
import subjectRoute from "./routes/subjects";
import teacherRoute from "./routes/teachers";
import timetableRoute from "./routes/timetable";
import userRoute from "./routes/users";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/v1/users", userRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/posts", postRoute);
app.use("/v1/subjects", subjectRoute);
app.use("/v1/rooms", roomRoute);
app.use("/v1/teachers", teacherRoute);
app.use("/v1/classes", classRoute);
app.use("/v1/timetable", timetableRoute);
app.use("/v1/schedule", scheduleRoute);
app.use("/v1/event", eventRoute);

export const Router = ExpressRouter();
