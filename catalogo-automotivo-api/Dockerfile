# Dockerfile para catalogo-automotivo-api
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Expõe a porta padrão
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
