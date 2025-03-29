FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npx turbo run build --filter=api...

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api/package.json .
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "dist/index.js"]
