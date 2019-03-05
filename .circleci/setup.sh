#!/bin/bash -x

sudo apt-get update && sudo apt-get install -yq --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libnss3
export NVM_DIR="/opt/circleci/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 11.2.0
npm install
npm test

EXITCODE=$?

if [ $EXITCODE != 0 ]; then
    exit 1
fi

docker pull orbsnetwork/gamma:experimental
docker run --name gamma -d -p "9000:8080" orbsnetwork/gamma:experimental
docker run --name mongo -d -p "27017:27017" mongo:3.3

npm run build
EXITCODE=$?

if [ $EXITCODE != 0 ]; then
    exit 1
fi

npm run test-e2e

EXITCODE=$?

if [ $EXITCODE != 0 ]; then
    exit 1
fi

docker rm -fv gamma mongo

exit 0