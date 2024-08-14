#!/bin/bash

DOCKER_IMAGE="brawl_stars_card_game"
DOCKER_CONTAINER_NAME="nifty_archimedes"
DOCKER_PORT="9000"

CONTAINER_ID=$(docker ps -a --filter "name=^/${DOCKER_CONTAINER_NAME}$" --format "{{.ID}}")
if [ -n "$CONTAINER_ID" ]; then
    echo "Stopping and removing container with ID: $CONTAINER_ID"
    docker stop "$CONTAINER_ID"
    docker rm -f "$CONTAINER_ID"
else
    echo "No container found with name ${DOCKER_CONTAINER_NAME}. Proceeding..."
fi

PORT_PID=$(lsof -ti:"$DOCKER_PORT")
if [ -n "$PORT_PID" ]; then
    echo "Killing process using port $DOCKER_PORT with PID: $PORT_PID"
    kill -9 "$PORT_PID"
else
    echo "No process found using port $DOCKER_PORT"
fi

while lsof -ti:"$DOCKER_PORT"; do
    echo "Waiting for port $DOCKER_PORT to be free..."
    sleep 1
done

echo "Deploying new container..."
docker run -d --name "$DOCKER_CONTAINER_NAME" -p "$DOCKER_PORT:$DOCKER_PORT" "$DOCKER_IMAGE"
