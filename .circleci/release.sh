#!/bin/bash
echo "*********************************************"
env

if [[ $CIRCLE_TAG == v* ]] ;
then
  PRISM_VERSION=$CIRCLE_TAG
else
  PRISM_VERSION=experimental
fi

docker login -u $DOCKER_HUB_LOGIN -p $DOCKER_HUB_PASSWORD

docker tag orbs:prism orbsnetwork/prism:$PRISM_VERSION

# docker push orbsnetwork/prism:$PRISM_VERSION
