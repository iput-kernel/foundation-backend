# 依存関係のインストール用のビルドステージ
FROM node:21 AS builder
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -g typescript
RUN npx prisma generate
RUN npm run build

# アプリケーションのビルドステージ
FROM node:21
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY . .

CMD ["npm", "run", "dev"]