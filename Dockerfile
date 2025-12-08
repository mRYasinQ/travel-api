FROM oven/bun:1.3.3-alpine AS base

RUN addgroup app && adduser -S -G app app

FROM base AS deps
WORKDIR /app
COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app
COPY /public ./public
COPY /drizzle ./drizzle
RUN mkdir -p /app/public/uploads && chown -R app:app /app/public/uploads
RUN mkdir -p /app/logs && chown -R app:app /app/logs
COPY run.sh drizzle.config.ts package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER app
