FROM node:6

EXPOSE 3000

WORKDIR /app

COPY . /app/

RUN npm install --production

CMD node module.js
