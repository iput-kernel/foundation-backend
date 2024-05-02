import httpStatus from "http-status";
import { authenticateJWT, RequestWithUser } from "../../jwtAuth";
import multer from "multer";
import csvParser from "csv-parser";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import minioClient from "../../utils/minioClient";

const roomRoute = Router();
const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();

interface RoomCsvData {
  name: string;
  seats: string;
  number: string;
}

roomRoute.post("/", authenticateJWT, async (req: RequestWithUser, res) => {
  try {
    if (req.user!.credLevel < 4) {
      res.status(httpStatus.FORBIDDEN).send("教室を作成する権限がありません。");
    }
    const newRoom = await prisma.room.create({
      data: {
        number: req.body.number,
        name: req.body.name,
        seats: req.body.seats,
      },
    });
    return res.status(httpStatus.OK).json(newRoom);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

roomRoute.post(
  "/upload",
  authenticateJWT,
  upload.single("file"),
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("教室をインポートする権限がありません。");
    }

    if (!req.file) {
      return res.status(400).send("ファイルがアップロードされていません。");
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileBuffer = req.file.buffer;

    // MinIOにファイルをアップロード
    minioClient.putObject("room-data-csv", fileName, fileBuffer, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("ファイルのアップロードに失敗しました。");
      }

      // アップロード成功のレスポンスを返す
      return res
        .status(200)
        .send({
          message: "ファイルが正常にアップロードされました。",
          fileName,
        });
    });
  },
);

roomRoute.post(
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
    minioClient.getObject("room-data-csv", fileName, (err, objStream) => {
      if (err) {
        return res.status(500).send("ファイルの読み込みに失敗しました。");
      }

      const results: RoomCsvData[] = [];

      objStream
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            // CSVファイルの解析が完了したら、データベースにデータを挿入
            await prisma.room.createMany({
              data: results.map((item) => ({
                number: item.number,
                name: item.name,
                seats: parseInt(item.seats, 10),
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

// roomをすべて取得
roomRoute.get("/", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.status(httpStatus.OK).json(rooms);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//特定のroomを取得
roomRoute.get("/:number", async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: {
        number: req.params.number,
      },
    });
    return res.status(httpStatus.OK).json(room);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

// userが管理者、もしくは信用レベルが4以上の場合にroomを削除
roomRoute.delete(
  "/:number",
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    try {
      if (req.user!.credLevel < 4) {
        return res
          .status(httpStatus.FORBIDDEN)
          .send("教室を削除する権限がありません。");
      }
      const deletedRoom = await prisma.room.delete({
        where: {
          number: req.params.number,
        },
      });
      return res.status(httpStatus.OK).json(deletedRoom);
    } catch (err) {
      console.log(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("内部エラーが発生しました。");
    }
  },
);

export default roomRoute;
