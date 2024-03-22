import httpStatus from 'http-status';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser, authenticateJWT } from '../jwtAuth';
import minioClient  from '../utils/minioClient';
import multer from 'multer';
import csvParser from 'csv-parser';

const teacherRoute = Router();
const prisma =  new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

interface TeacherCsvData {
  name: string;
  course: string;
}

// Create a teacher but only admin or has cred-level of 4 or higher
teacherRoute.post('/', 
async (req:RequestWithUser, res) => {
  if (req.user!.credLevel < 4){
    return res
      .status(httpStatus.OK)
      .send('教員を登録する権限がありません。')
  }
  try {
    const newTeacher = await prisma.teacher.create({
      data:{
        name: req.body.name,
      },
    });
    return res
      .status(httpStatus.OK)
      .json(newTeacher)
  } catch (err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('内部エラーが発生しました。');
  }
});

teacherRoute.post('/upload',
  authenticateJWT,
  upload.single('file'), 
  async (req:RequestWithUser, res) => {
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
    minioClient.putObject('teacher-data-csv', fileName, fileBuffer, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('ファイルのアップロードに失敗しました。');
      }

      // アップロード成功のレスポンスを返す
      return res.status(200).send({ message: 'ファイルが正常にアップロードされました。', fileName });
    });
});

teacherRoute.post('/import/:fileName',
  authenticateJWT,
  async (req:RequestWithUser, res) => {
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
    minioClient.getObject('teacher-data-csv', fileName, (err, objStream) => {
      if (err) {
        return res.status(500).send('ファイルの読み込みに失敗しました。');
      }

      const results: TeacherCsvData[] = [];

      objStream.pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            // CSVファイルの解析が完了したら、データベースにデータを挿入
            await prisma.teacher.createMany({
              data: results.map(item => ({
                name: item.name,
              })),
            });
            return res.status(200).send('クラスが正常にインポートされました。');
          } catch (err) {
            return res.status(500).json(err);
          }
        });
    });
});

// Get all teachers
teacherRoute.get('/', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.status(httpStatus.OK).json(teachers);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Delete a teacher but only admin or has cred-level of 4 or higher
teacherRoute.delete('/:id', async (req:RequestWithUser, res) => {
  if (req.user!.credLevel < 4) {
    return res
      .status(httpStatus.OK)
      .send('教員を削除する権限がありません。')
  }
  try {
    const deletedTeacher = await prisma.teacher.delete({
      where: {
        id: req.params.id,
      },
    })
    return res
      .status(httpStatus.OK)
      .json(deletedTeacher)
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default teacherRoute;
