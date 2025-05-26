# Use a Node.js base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from the base stage
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
