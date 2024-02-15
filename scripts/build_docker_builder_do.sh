#!/bin/bash
set -e
set -x

STAGE="dig"
TAG="dig-do-76.1.76677"
LABEL="etherealengine/etherealengine"
DOCR_REGISTRY="registry.digitalocean.com/etherealengine"
REPO_NAME="etherealengine-dig"
EEVERSION=$(jq -r .version ./packages/server-core/package.json)

echo "Entering the script"

doctl registry login

docker buildx build \
    --load \
    --build-arg NODE_ENV=$NODE_ENV \
    -t $DOCR_REGISTRY/$REPO_NAME-root:${TAG} \
    -t $DOCR_REGISTRY/$REPO_NAME-root:latest_$STAGE \
    -t ee-base:latest \
    -f dockerfiles/root/Dockerfile-root .
docker push --all-tags $DOCR_REGISTRY/$REPO_NAME-root

if [ $PUBLISH_DOCKERHUB == 'true' ]
then
  echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

  docker buildx build \
    --load \
    --build-arg ECR_URL=$DOCR_REGISTRY \
    --build-arg REPO_NAME=$REPO_NAME \
    --build-arg STAGE=$STAGE \
    -t $DOCR_REGISTRY/etherealengine-builder:latest_$STAGE \
    -t $DOCR_REGISTRY/etherealengine-builder:"${EEVERSION}_${TAG}" \
    -t ${LABEL}-builder:"${EEVERSION}_${TAG}" \
    -f dockerfiles/builder/Dockerfile-builder .
  docker push $DOCR_REGISTRY/etherealengine-builder:latest_$STAGE
  docker push $DOCR_REGISTRY/etherealengine-builder:"${EEVERSION}_${TAG}"
  docker push ${LABEL}-builder:"${EEVERSION}_${TAG}"
else
  docker buildx build \
    --load \
    --build-arg ECR_URL=$DOCR_REGISTRY \
    --build-arg REPO_NAME=$REPO_NAME \
    --build-arg STAGE=$STAGE \
    -t $DOCR_REGISTRY/etherealengine-builder:latest_$STAGE \
    -t $DOCR_REGISTRY/etherealengine-builder:"${EEVERSION}_${TAG}" \
    -f dockerfiles/builder/Dockerfile-builder .
  docker push $DOCR_REGISTRY/etherealengine-builder:latest_$STAGE
  docker push $DOCR_REGISTRY/etherealengine-builder:"${EEVERSION}_${TAG}"
fi

# The following scripts will need to be updated for DOCR but are not critical for the functionality of EE on DO.


# cache links to use once ECR supports cache manifests
#  --cache-to type=registry,ref=$ECR_URL/$REPO_NAME-builder:latest_"${STAGE}"_cache,mode=max \
#  --cache-from $ECR_URL/$REPO_NAME-builder:latest_"${STAGE}"_cache \