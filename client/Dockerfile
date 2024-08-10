# client/Dockerfile
FROM ubuntu:20.04

# Избежание интерактивных запросов во время установки пакетов
ARG DEBIAN_FRONTEND=noninteractive

# Обновить репозиторий Ubuntu и установить curl
RUN apt-get update && apt-get install -y \
    curl && apt-get clean

# Установка Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

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

# Сборка React-приложения
RUN npm run build

# Открытие порта для приложения
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]