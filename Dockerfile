# 빌드 단계
FROM node:18 as build

# 작업 디렉토리 생성 및 설정
WORKDIR /app

# package.json과 package-lock.json만 복사하여 의존성 설치
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 소스 코드를 작업 디렉토리로 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 프로덕션 이미지 생성
FROM node:18-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 결과물만 복사
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/src ./src

# 다음 파일들은 복사하지 않음:
# - .env 파일은 민감한 정보가 포함될 수 있으므로 프로덕션 환경에 복사하지 않음
# - node_modules는 production에서 재설치
# - 기타 불필요한 개발 관련 파일들(.git, .github 등)

# 프로덕션 의존성 설치
RUN npm install --only=production

# 포트 설정
EXPOSE 3000

# 애플리케이션 시작 명령어
CMD ["npm", "start"]