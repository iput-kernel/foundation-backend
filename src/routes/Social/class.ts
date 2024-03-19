import httpStatus from 'http-status';
import { Router } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import { authenticateJWT, RequestWithUser } from '../../jwtAuth';
import { PrismaClient } from '@prisma/client';
import minioClient  from '../../utils/minioClient';

const classRoute = Router();
const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();

interface ClassCsvData {
  grade: string;
  department: string;
  course: string;
  className: string;
  studentsCount: string;
}

// クラス
classRoute.post('/',
  authenticateJWT,
  async (req:RequestWithUser, res) => {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send('クラスを作成する権限がありません。');
    }
    try{
      const newClass = await prisma.class.create({
        data: {
          grade: req.body.grade,
          department: req.body.department,
          course: req.body.course,
          className: req.body.className,
          studentsCount: req.body.studentsCount,
        },
      });
      return res.status(httpStatus.OK).json(newClass);
    }catch(err){
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
});

classRoute.post('/upload',
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
    minioClient.putObject('class-data-csv', fileName, fileBuffer, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('ファイルのアップロードに失敗しました。');
      }

      // アップロード成功のレスポンスを返す
      return res.status(200).send({ message: 'ファイルが正常にアップロードされました。', fileName });
    });
});

classRoute.post('/import/:fileName',
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
    minioClient.getObject('class-data-csv', fileName, (err, objStream) => {
      if (err) {
        return res.status(500).send('ファイルの読み込みに失敗しました。');
      }

      const results: ClassCsvData[] = [];

      objStream.pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            // CSVファイルの解析が完了したら、データベースにデータを挿入
            await prisma.class.createMany({
              data: results.map(item => ({
                grade: parseInt(item.grade, 10),
                department: item.department,
                course: item.course,
                className: item.className,
                studentsCount: parseInt(item.studentsCount, 10),
              })),
            });
            return res.status(200).send('クラスが正常にインポートされました。');
          } catch (err) {
            return res.status(500).json(err);
          }
        });
    });
});

//特定のクラスの取得
classRoute.get('/:id', async (req, res) => {
  try {
    const clazz = prisma.class.findUnique({
      where:{
        id: req.params.id
      },
    })
    return res.status(httpStatus.OK).json(clazz);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

// クラスをすべて取得
classRoute.get('/', async (req, res) => {
  try {
    const classes = await prisma.class.findMany();
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default classRoute;
