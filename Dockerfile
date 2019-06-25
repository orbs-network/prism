FROM node:11-alpine

EXPOSE 3000

RUN apk add --no-cache git

ADD package*.json /opt/prism/

WORKDIR /opt/prism

RUN npm install --production

ADD index.js /opt/prism/index.js

ADD assets /opt/prism/assets

ADD dist /opt/prism/dist

ADD views /opt/prism/views

ENV NODE_ENV=production

CMD node index.js
