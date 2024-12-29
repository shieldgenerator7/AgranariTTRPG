# 2024-12-29: copied from https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/


FROM node:20.12.2

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD [ "node", "server.js" ]