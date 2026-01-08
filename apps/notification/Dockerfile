# 어떤 이미지를 사용할 지
FROM node:alpine AS development

WORKDIR /usr/src/app

# package.json 복사해오기
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Dependency 설치하기
RUN npm i

# 프로젝트 빌드에 필요한 폴더 이동하기
COPY apps/notification apps/notification
COPY libs libs

RUN npm run build notification

# 커멘드 실행
CMD ["npm", "run", "start:dev", "notification"]

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist
COPY proto proto

CMD ["node", "dist/apps/notification/main"]