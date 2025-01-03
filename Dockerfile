ARG NODE_VERSION=22.12.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/code/app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm","run","dev" ]

