FROM node:18-alpine

RUN npm install -g yarn
RUN yarn install -g ts-node

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN yarn

ENV NODE_ENV=production

RUN yarn run m:gen -- src/migrations/InitDB

RUN yarn run m:run

EXPOSE 8088

CMD ["yarn","start"]
