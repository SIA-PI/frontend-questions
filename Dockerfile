# Dockerfile para Frontend (Express Server)
FROM node:20-alpine

WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1000 appgroup && \
    adduser -D -u 1000 -G appgroup appuser

# Copiar package files
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build se necessário)
RUN npm ci --only=production

# Copiar código da aplicação
COPY --chown=appuser:appuser . .

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Comando
CMD ["node", "server.js"]
