FROM node:16.13.0

WORKDIR /app/src/server

COPY ["./src/server/package.json", "./src/server/package-log.json*", "./"]

RUN npm install

WORKDIR /app

COPY . .

WORKDIR /app/src/server

ENV PORT=8080

EXPOSE $PORT

CMD ["node", "server.js"]