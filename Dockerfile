FROM node:latest

EXPOSE 3000

WORKDIR /app

COPY . /app/

RUN npm install

CMD node module.js
