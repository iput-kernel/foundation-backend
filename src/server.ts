import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { app } from './route';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  console.log('試験環境用環境変数ファイルを読み込み')
}

const PORT = 4000;
const prisma = new PrismaClient();

async function main() {
  try {
    // Prisma Clientを使用してデータベース接続を確立
    await prisma.$connect();
    console.log('データベースに接続しました');
  } catch (err) {
    console.log('データベース接続エラー:', err);
  }

  app.listen(PORT, () => console.log('サーバーが起動しました'));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });