FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npx turbo run build --filter=web...

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
