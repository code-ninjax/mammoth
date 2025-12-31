FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY mammoth-sdk/package.json mammoth-sdk/package.json
COPY mammoth-node/package.json mammoth-node/package.json
COPY smart-contracts/package.json smart-contracts/package.json

ENV NODE_ENV=development
RUN npm ci --include=dev

COPY . .

RUN npm run sdk:build && npm run build

ENV NODE_ENV=production

CMD ["node", "mammoth-node/server.js"]
