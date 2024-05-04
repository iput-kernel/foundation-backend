import httpStatus from "http-status";
import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

import csvParser from "csv-parser";
import minioClient from "../utils/minioClient";

interface TimetableCsvData {
  dayOfWeek: string;
  period: string;
  startTime: string;
  endTime: string;
}

const timetableRoute = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

timetableRoute.get("/", async (req, res) => {
  try {
    const timetables = await prisma.timetable.findMany();
    return res.status(httpStatus.OK).json(timetables);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

timetableRoute.get("/:id", async (req, res) => {
  try {
    const timetables = await prisma.timetable.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        commonLecture: true,
        extraLecture: true,
      },
    });
    return res.status(httpStatus.OK).json(timetables);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

timetableRoute.post("/", authenticateJWT, async (req: RequestWithUser, res) => {
  try {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("タイムテーブルを作成する権限がありません。");
    }
    const timetables = await prisma.timetable.create({
      data: {
        dayOfWeek: req.body.dayOfWeek,
        period: req.body.period,
        startTime: `1970-01-01T${req.body.startTime}+09:00`,
        endTime: `1970-01-01T${req.body.endTime}+09:00`,
      },
    });
    return res.status(httpStatus.OK).json(timetables);
  } catch (err: unknown) {
    console.log(err);
    // デフォルトのステータスコード
    const statusCode = 500;
    const errorMessages = ["内部エラーが発生しました。"];
    return res.status(statusCode).json({
      statusCode,
      error: errorMessages,
    });
  }
});

timetableRoute.post(
  "/upload",
  authenticateJWT,
  upload.single("file"),
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("クラスデータをインポートする権限がありません。");
    }

    if (!req.file) {
      return res.status(400).send("ファイルがアップロードされていません。");
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileBuffer = req.file.buffer;

    // MinIOにファイルをアップロード
    minioClient.putObject("timetable-data-csv", fileName, fileBuffer, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("ファイルのアップロードに失敗しました。");
      }

      // アップロード成功のレスポンスを返す
      return res.status(200).send({
        message: "ファイルが正常にアップロードされました。",
        fileName,
      });
    });
  },
);

timetableRoute.post(
  "/import/:fileName",
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("データベースへのインポート権限がありません。");
    }

    const fileName = req.params.fileName;

    if (!fileName) {
      return res.status(400).send("ファイル名が指定されていません。");
    }

    // MinIOからファイルをストリームとして読み込む
    minioClient.getObject("timetable-data-csv", fileName, (err, objStream) => {
      if (err) {
        return res.status(500).send("ファイルの読み込みに失敗しました。");
      }

      const results: TimetableCsvData[] = [];

      objStream
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            // CSVファイルの解析が完了したら、データベースにデータを挿入
            await prisma.timetable.createMany({
              data: results.map((item) => ({
                dayOfWeek: parseInt(item.dayOfWeek, 10),
                period: parseInt(item.period, 10),
                startTime: `1970-01-01T${item.startTime}+09:00`,
                endTime: `1970-01-01T${item.startTime}+09:00`,
              })),
            });
            return res.status(200).send("クラスが正常にインポートされました。");
          } catch (err) {
            return res.status(500).json(err);
          }
        });
    });
  },
);
export default timetableRoute;
