# Frontend Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Nginx Stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000