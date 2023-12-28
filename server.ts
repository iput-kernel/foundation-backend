import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import cors from "cors";
import express from "express";
const app = express();

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

const PORT = 4000;
import mongoose from "mongoose";

//データベース接続
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log(process.env.MONGO_URI + "に接続");
  })
  .catch((err: Error) => {
    console.log(err);
  });

//ミドルウェア
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

app.listen(PORT, () => console.log("サーバーが起動しました"));
