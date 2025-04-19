# Etapa 1: Dependencias
FROM node:22.2-alpine3.19 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Etapa 2: Compilación
FROM node:22.2-alpine3.19 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: Producción
FROM node:22.2-alpine3.19 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
