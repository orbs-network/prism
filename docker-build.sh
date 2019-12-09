#!/bin/bash +xe

nvm use 10.17.0
npm run build

docker build -t orbs:prism .
