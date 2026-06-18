FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY src ./src

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
