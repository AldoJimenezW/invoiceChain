FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npx turbo run build --filter=admin...

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/admin/package.json .
COPY --from=builder /app/apps/admin/build ./build
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
