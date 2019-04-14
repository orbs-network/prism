FROM node:11-alpine

RUN apk add --no-cache git

ADD package*.json /opt/prism/

WORKDIR /opt/prism

RUN npm install --production

ADD index.js /opt/prism/index.js

ADD assets /opt/prism/assets

ADD dist /opt/prism/dist

CMD node index.js
