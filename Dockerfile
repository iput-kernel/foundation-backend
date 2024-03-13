# 依存関係のインストール用のビルドステージ
FROM node:21
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install -g typescript

RUN npx prisma generate

COPY . .

CMD ["npm", "run", "dev"]