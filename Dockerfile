# Etapa 1: Builder de Assets
FROM node:20-alpine as assets-builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Etapa 2: Builder de PHP
FROM php:8.2-fpm-alpine

# Instala dependências do PHP
RUN apk add --no-cache \
    bash \
    curl \
    libpng \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    zip \
    unzip \
    icu-dev \
    oniguruma-dev \
    git \
    supervisor \
    nginx \
    tzdata \
    cron \
    && docker-php-ext-install pdo pdo_mysql intl mbstring exif pcntl bcmath gd

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Define diretório da aplicação
WORKDIR /var/www/html

# Copia código da aplicação
COPY --from=assets-builder /app /var/www/html

# Permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Instala dependências PHP
RUN composer install --no-interaction --no-progress --prefer-dist --optimize-autoloader

# Copia arquivos de configuração do supervisord para rodar o cron + php-fpm
COPY ./docker/supervisord.conf /etc/supervisord.conf

# Expõe porta do PHP-FPM
EXPOSE 9000

# Entrypoint
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
