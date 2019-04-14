FROM node:11-alpine

RUN apk add --no-cache git

ADD package.json /opt/prism/package.json

WORKDIR /opt/prism

RUN npm install

ADD . /opt/prism

RUN npm run build

CMD node index.js
