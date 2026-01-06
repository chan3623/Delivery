# 어떤 이미지를 사용할 지
FROM node:alpine AS development

WORKDIR /usr/src/app

# package.json 복사해오기
COPY package*.json ./

# Dependency 설치하기
RUN npm i

# 나머지 파일/폴더 복사해오기
COPY . .

# 커멘드 실행
CMD ["npm", "run", "start:dev", "order"]