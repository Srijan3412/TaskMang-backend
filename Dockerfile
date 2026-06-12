# Step 1: Base node image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

# Step 2: Clean production run container
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]
