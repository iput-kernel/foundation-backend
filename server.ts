import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const app = express();
const cors = require("cors");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const subjectRoute = require("./routes/subjects");
const roomRoute = require("./routes/rooms");
const teacherRoute = require("./routes/teachers");
const classRoute = require("./routes/classes");
const timetableRoute = require("./routes/timetable");
const scheduleRoute = require("./routes/schedule");

const PORT = 4000;
const mongoose = require("mongoose");

//データベース接続
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(process.env.MONGO_URI+"に接続");
    }).catch((err: Error) => {
        console.log(err);
    });

//ミドルウェア
app.use(express.json());
app.use(cors());
app.use("/v1/users",userRoute);
app.use("/v1/auth",authRoute);
app.use("/v1/posts",postRoute);
app.use("/v1/subjects",subjectRoute);
app.use("/v1/rooms",roomRoute);
app.use("/v1/teachers",teacherRoute);
app.use("/v1/classes",classRoute);
app.use("/v1/timetable",timetableRoute);
app.use("/v1/schedule",scheduleRoute);

app.listen(PORT,() => console.log("サーバーが起動しました"));