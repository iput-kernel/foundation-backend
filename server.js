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

const PORT = 4000;
const mongoose = require("mongoose");

//データベース接続
mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>{
    console.log("DB接続中");
    }).catch((err) => {
        console.log(err);
    });

//ミドルウェア
app.use(express.json());
app.use(cors());
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use("/api/subjects",subjectRoute);
app.use("/api/rooms",roomRoute);
app.use("/api/teachers",teacherRoute);
app.use("/api/classes",classRoute);
app.use("/api/timetable",timetableRoute);

app.listen(PORT,() => console.log("サーバーが起動しました"));