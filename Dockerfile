FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install -g typescript

COPY . .

RUN npm run build
CMD [ "npm", "run", "start" ]