#!/bin/bash

docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-gateway -f ./apps/gateway/Dockerfile --target product .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-notification -f ./apps/notification/Dockerfile --target product .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-order -f ./apps/order/Dockerfile --target product .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-payment -f ./apps/payment/Dockerfile --target product .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-product -f ./apps/product/Dockerfile --target product .
docker build build --platform linux/amd64, linux/arm64 -t chn3623/nestjs-user -f ./apps/user/Dockerfile --target product .

docker push chn3623/nestjs-gateway:latest
docker push chn3623/nestjs-notification:latest
docker push chn3623/nestjs-order:latest
docker push chn3623/nestjs-payment:latest
docker push chn3623/nestjs-product:latest
docker push chn3623/nestjs-user:latest