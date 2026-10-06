# Use lightweight Node 18 Alpine image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first to optimize Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining backend source code
COPY . .

# Generate Prisma Client code for PostgreSQL
RUN npx prisma generate

# Expose server port
EXPOSE 5000

# Set environment defaults
ENV PORT=5000
ENV NODE_ENV=production

# Container Healthcheck (Monitors API readiness)
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start Node.js Express server
CMD ["node", "src/server.js"]
