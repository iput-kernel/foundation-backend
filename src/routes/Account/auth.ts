import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';
import { Router } from 'express';

const authRoute = Router();
const prisma = new PrismaClient();

const saltRounds = 10;

authRoute.post('/register', async (req, res) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        auth: true,
        class: true,
        profile: true,
      },
    });
    if (findUser && findUser.auth?.verifiedAt)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send('このメールアドレスはすでに登録されています。');
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const token = crypto.randomBytes(16).toString('hex');

    if (findUser) {
      // 既存のユーザーが存在する場合、トークンを更新
      await prisma.auth.update({
        where: {
          userId: findUser.id,
        },
        data: {
          confirmToken: token,
        },
      });
    } else {
      // User作成
      await prisma.$transaction(
        async (prisma) => {
          const user = await prisma.user.create({
            data: {
              name: req.body.userName,
              email: req.body.email,
            },
          });

          const auth = await prisma.auth.create({
            data: {
              userId: user.id,
              passwordHash: hashedPassword,
              confirmToken: token,
            },
          });

          const profile = await prisma.profile.create({
            data: {
              userId: user.id,
            },
          });

          return { user, auth, profile };
        }
      );
    }
    
    await sendConfirmationEmail(req.body.email, token);

    return res
      .status(httpStatus.OK)
      .json({ message: 'Confirmation email sent'});
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

authRoute.get('/confirm-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (typeof token !== 'string') {
      return res.status(httpStatus.BAD_REQUEST).send('無効なトークン形式です。');
    }
    const newSecretKey = crypto.randomBytes(32).toString('hex');

    await prisma.auth.update({
      where: {
        confirmToken: token,
      },
      data: {
        secretKey: newSecretKey,
        verifiedAt: new Date(),
      },
    }).catch(() => {
      return res.status(httpStatus.BAD_REQUEST).send('無効なトークンです。');
    });
    
    return res.status(httpStatus.OK).send('アカウントが認証されました。');
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

authRoute.post('/login', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        auth: true,
        class: true,
        profile: true,
      },
    });
    if (!user) return res.status(404).send('ユーザーが見つかりません');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.auth!.passwordHash
    );

    if (!validPassword)
      return res.status(httpStatus.BAD_REQUEST).json('パスワードが違います');

    if (!user.auth!.secretKey) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send('サーバー内部エラー: ユーザーの秘密鍵が見つかりません');
    }
    console.log(user);
    console.log(user.auth);

    // JWTの署名
    const secret = user.auth!.secretKey;
    if (!secret) {
      throw new Error('No secret key found for the given user.');
    }
    const payload = {
      id: user.id,
      credLevel: user.auth!.credLevel
    }
    const token = jwt.sign(payload, secret);

    // ユーザー情報からpasswordと他の不要なフィールドを除外
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { auth, ...userResponse } = user;

    return res.status(httpStatus.OK).json({ user: userResponse, token });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

async function sendConfirmationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'iput.kernel@gmail.com',
      pass: process.env.MAILPASS,
    },
  });

  // リンクをクエリパラメータ形式に変更
  const link = `https://www.iput-kernel.com/v1/auth/confirm-email?token=${token}`;

  const mailOptions = {
    from: 'iput-kernel@gmail.com',
    to: email,
    subject: 'アカウント登録',
    text: 'このリンクをクリックすれば有効化されるよ: ' + link,
  };

  await transporter.sendMail(mailOptions);
}

export default authRoute;
