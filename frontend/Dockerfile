# Stage 1: Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Vite outputs to /dist
COPY --from=build /app/dist /usr/share/nginx/html
# Only include the line below if you have created the nginx.conf file!
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]