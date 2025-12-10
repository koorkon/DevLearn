# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy .env file (create this from your environment variables)
COPY .env.production /usr/share/nginx/html/.env

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
