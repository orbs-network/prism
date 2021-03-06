#!/bin/bash

export NVM_DIR="/opt/circleci/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm use 10.17.0
npm test

EXITCODE=$?

if [ $EXITCODE != 0 ]; then
    echo "npm test failed so exiting.."
    exit 1
fi

docker pull orbsnetwork/gamma:experimental
echo "Running gamma-server on port 8080"
docker run --name gamma -d -p "8080:8080" orbsnetwork/gamma:experimental

echo "sleeping before running the e2e tests"
sleep 15

echo "running E2E tests"
npm run test-e2e

EXITCODE=$?

if [ $EXITCODE != 0 ]; then
    exit 1
fi

docker rm -fv gamma mongo

exit 0
