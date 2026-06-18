FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node openapi.yaml ./
COPY --chown=node:node src ./src

EXPOSE 3001

USER node

CMD ["npm", "start"]
