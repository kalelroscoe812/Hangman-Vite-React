FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js

EXPOSE 4000
CMD ["node", "server.js"]
