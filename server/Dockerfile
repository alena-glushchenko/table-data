# server/Dockerfile
FROM ubuntu:20.04

# Избежание интерактивных запросов во время установки пакетов
ARG DEBIAN_FRONTEND=noninteractive

# Обновление списка пакетов и установка Node.js, npm
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    nodejs \
    npm \
    && apt-get clean

# Обновить репозиторий Ubuntu
RUN apt-get update && apt-get install -y \
    npm && apt-get clean

# Проверка установленных версий
RUN node -v && npm -v

# Установка рабочего каталога
WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальной части приложения
COPY . .

# Открытие порта для приложения
EXPOSE 8085

# Запуск приложения
CMD ["node", "server.js"]