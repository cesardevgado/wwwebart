FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DATABASE_PATH=/app/data/portfolio.db
RUN mkdir -p data/uploads && npm run db:migrate && ADMIN_PASSWORD=build-only-password SESSION_SECRET=build-only-secret-at-least-32-characters npm run db:seed && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 DATABASE_PATH=/data/portfolio.db UPLOAD_DIR=/data/uploads
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next/standalone ./.next/standalone
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/db ./db
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/tsconfig.json ./tsconfig.json
EXPOSE 3000
CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && node .next/standalone/server.js"]
