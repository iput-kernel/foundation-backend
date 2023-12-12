FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./

RUN npm install

COPY . .

RUN  npm run build
CMD [ "npm", "run", "start" ]