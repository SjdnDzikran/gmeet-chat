# chat-service/Dockerfile

# 1. Base Image for building the application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# 2. Production Image - smaller image for running the app
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json

# Expose the port the app runs on (defined in your server.ts)
EXPOSE 8080

# Command to run the application
# This will use the "start" script from your package.json: "node dist/server.js"
CMD [ "npm", "start" ]