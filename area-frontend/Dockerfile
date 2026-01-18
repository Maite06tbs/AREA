# Étape 1 : Build
FROM node:22-slim as build-stage
WORKDIR /app
# Increase memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"
COPY package*.json ./
RUN npm install
COPY . .
# Use Docker-specific environment file for build
COPY .env.docker .env.production
RUN npm run build-only

# Étape 2 : Production avec Nginx
FROM nginx:alpine as production-stage

# Copier les fichiers construits vers Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Le volume partagé pour l'APK sera monté ici
RUN mkdir -p /shared

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
