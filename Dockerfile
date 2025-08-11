FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
# Si no estás 100% seguro de dev vs prod, usa solo:
# RUN npm ci
RUN npm ci --only=production

# Copia TODO (incluye src/ y config/)
COPY config/sml.yaml ./config/sml.yaml
COPY . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["npm","start"]
