# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Ensure env variables are available during build if .env is present in context
# or passed as build args. For this setup, we rely on .env being copied via COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
