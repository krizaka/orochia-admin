# Orochia operator console — standalone production image (App Platform: deploy/app-spec.dev.yaml).
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@11 && npm ci

FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# The build badge in the header: environment (hidden in production) and commit — .git is not in the build context,
# App Platform passes APP_COMMIT_SHA = ${_self.COMMIT_HASH} (deploy/app-spec.dev.yaml).
ARG NEXT_PUBLIC_APP_ENV
ARG APP_COMMIT_SHA
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV APP_COMMIT_SHA=$APP_COMMIT_SHA
RUN npm run build

FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3001 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3001
CMD ["node", "server.js"]
