# 依存関係のインストール用のビルドステージ
FROM node:21
WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install
RUN npm install -g typescript
RUN npx prisma migrate dev
RUN npx prisma generate

CMD ["npm", "run", "dev"]