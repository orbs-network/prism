#!/bin/bash +xe

npm run build

docker build -t orbs:prism .
