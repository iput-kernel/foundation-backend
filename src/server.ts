import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { app } from './route';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  console.log('試験環境用環境変数ファイルを読み込み')
}

const PORT = 4000;

// データベース接続
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log(process.env.MONGO_URI + 'に接続');
  })
  .catch((err: Error) => {
    console.log(err);
  });

// サーバースタート
app.listen(PORT, () => console.log('サーバーが起動しました'));