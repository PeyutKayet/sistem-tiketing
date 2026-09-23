FROM node:20-alpine

WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy semua file dan jalankan build (SSR)
COPY . .
RUN npm run build

# Ekspos port default Nuxt Nitro
EXPOSE 3000

# Jalankan server
CMD ["node", ".output/server/index.mjs"]
