import httpStatus from 'http-status';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser, authenticateJWT } from '../jwtAuth';
import minioClient from '../utils/minioClient';
import multer from 'multer';
import csvParser from 'csv-parser';

const subjectRoute = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

interface SubjectCsvData {
  name: string;
  count: string;
  isRequire: string;
}

// Subject作成
subjectRoute.post('/', authenticateJWT, async (req: RequestWithUser, res) => {
  if (req.user!.credLevel < 3) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send('科目を追加する権限がありません。');
  }
  try {
    await prisma.$transaction(async (prisma) => {
      const newSubject = await prisma.subject.create({
        data: {
          name: req.body.name,
          count: req.body.count,
          isRequire: req.body.isRequire,
        },
      });
      return res.status(httpStatus.OK).json(newSubject);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send('内部エラーが発生しました。');
  }
});

subjectRoute.post(
  '/upload',
  authenticateJWT,
  upload.single('file'),
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send('クラスデータをインポートする権限がありません。');
    }

    if (!req.file) {
      return res.status(400).send('ファイルがアップロードされていません。');
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileBuffer = req.file.buffer;

    // MinIOにファイルをアップロード
    minioClient.putObject('subject-data-csv', fileName, fileBuffer, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('ファイルのアップロードに失敗しました。');
      }

      // アップロード成功のレスポンスを返す
      return res.status(200).send({
        message: 'ファイルが正常にアップロードされました。',
        fileName,
      });
    });
  },
);

subjectRoute.post(
  '/import/:fileName',
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send('データベースへのインポート権限がありません。');
    }

    const fileName = req.params.fileName;

    if (!fileName) {
      return res.status(400).send('ファイル名が指定されていません。');
    }

    // MinIOからファイルをストリームとして読み込む
    minioClient.getObject('subject-data-csv', fileName, (err, objStream) => {
      if (err) {
        return res.status(500).send('ファイルの読み込みに失敗しました。');
      }

      const results: SubjectCsvData[] = [];

      objStream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            // CSVファイルの解析が完了したら、データベースにデータを挿入
            await prisma.subject.createMany({
              data: results.map((item) => ({
                name: item.name,
                count: parseInt(item.count, 10),
                isRequire: item.isRequire === 'true',
              })),
            });
            return res.status(200).send('クラスが正常にインポートされました。');
          } catch (err) {
            return res.status(500).json(err);
          }
        });
    });
  },
);

// Subject更新
subjectRoute.put('/:id', authenticateJWT, async (req: RequestWithUser, res) => {
  if (req.user!.credLevel < 4) {
    return res.status(httpStatus.FORBIDDEN).send('内部エラーが発生しました。');
  }
  try {
    const subject = await prisma.subject.update({
      where: {
        id: req.params.id,
      },
      data: {
        teacher: {
          connect: req.body.teacherIds.map((teacherId: string) => ({
            id: teacherId,
          })),
        },
      },
    });
    return res.status(httpStatus.OK).json(subject);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Subject削除
subjectRoute.delete('/:id', async (req: RequestWithUser, res) => {
  try {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send('科目を削除する権限がありません。');
    }
    const deletedSubject = await prisma.subject.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(httpStatus.OK).json(deletedSubject);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// 全てのSubject取得
subjectRoute.get('/', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: { teacher: true },
    });
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default subjectRoute;
