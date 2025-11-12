# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (includes CSS compilation and TypeScript)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public

# Change ownership of app directory to non-root user
RUN chown -R nodejs:nodejs /app

# Set default port (can be overridden)
ENV PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
