import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    credLevel: number;
  };
}

const prisma = new PrismaClient();

export const authenticateJWT = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const bearerHeader = req.headers["authorization"];
  console.log(req.headers);

  if (typeof bearerHeader != "string") {
    return res.status(403).json({ message: "トークンの形式が不正です" });
  }

  const bearer = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(bearer);
    if (typeof decoded === "string" || !decoded) {
      return res.status(403).json({ message: "トークンの形式が不正です" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        auth: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const secret = user.auth!.secretKey;
    if (!secret) {
      throw new Error("No secret key found for the given user.");
    }

    jwt.verify(bearer, secret);

    req.user = decoded as { id: string; credLevel: number };
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "無効トークン" });
  }
};
