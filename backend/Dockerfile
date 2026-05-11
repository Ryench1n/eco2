FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build-ts

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# Copy JSON data files needed by the compiled JS (../data/ relative to dist/services/)
COPY --from=builder /app/src/data ./dist/data

EXPOSE 3000
CMD ["node", "dist/index.js"]
