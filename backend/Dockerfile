FROM node:24.15.0-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (need devDependencies for TypeScript build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js
