import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { app } from "./route";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = 4000;

//データベース接続
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log(process.env.MONGO_URI + "に接続");
  })
  .catch((err: Error) => {
    console.log(err);
  });

// サーバースタート
app.listen(PORT, () => console.log("サーバーが起動しました"));
