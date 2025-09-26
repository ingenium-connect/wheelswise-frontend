# Build
FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Run (standalone)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy build output before switching user
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure writable cache dir for Next.js images
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app

# Drop privileges
USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]