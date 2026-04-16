FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY drizzle.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Generate Drizzle migrations
RUN npx drizzle-kit generate

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
