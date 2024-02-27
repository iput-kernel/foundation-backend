# 依存関係のインストール用のビルドステージ
FROM node:20 AS builder
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -g typescript
RUN npm run build

# アプリケーションのビルドステージ
FROM node:20
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "start"]