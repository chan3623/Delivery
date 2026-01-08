#!/bin/bash

docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-gateway:latest -f ./apps/gateway/Dockerfile --target production .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-notification:latest -f ./apps/notification/Dockerfile --target production .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-order:latest -f ./apps/order/Dockerfile --target production .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-payment:latest -f ./apps/payment/Dockerfile --target production .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-product:latest -f ./apps/product/Dockerfile --target production .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-user:latest -f ./apps/user/Dockerfile --target production .

docker push chn3623/nestjs-gateway:latest
docker push chn3623/nestjs-notification:latest
docker push chn3623/nestjs-order:latest
docker push chn3623/nestjs-payment:latest
docker push chn3623/nestjs-product:latest
docker push chn3623/nestjs-user:latest