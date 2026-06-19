# syntax=docker/dockerfile:1

FROM node:22-slim AS dependencies

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./

RUN npm ci

COPY backend/prisma ./prisma

RUN npx prisma generate

FROM node:22-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./

RUN npm ci --omit=dev \
  && npm cache clean --force

COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY backend/prisma ./prisma
COPY backend/server.js ./server.js
COPY backend/src ./src

EXPOSE 5000

USER node

CMD ["npm", "start"]
