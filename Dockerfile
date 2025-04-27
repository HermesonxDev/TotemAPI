# syntax=docker/dockerfile:1

FROM php:8.2-fpm-alpine AS stage-1

# Instalando dependências
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
    nginx \
    supervisor \
    tzdata \
    nodejs \
    npm \
    dcron \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        intl \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd

# Copiar o Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Diretório de trabalho
WORKDIR /var/www

# Copiar todos os arquivos do projeto
COPY . .

# Corrigir configuração nginx
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Instalar dependências PHP (ignorando requisitos de plataforma tipo ext-mongodb)
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Criar um .env baseado no .env.example para conseguir gerar a chave APP_KEY
RUN cp .env.example .env

# Gerar chave de APP
RUN php artisan key:generate --force

# Garantir permissões corretas
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expor a porta 80
EXPOSE 80

# Rodar supervisord que gerencia nginx + php-fpm
CMD ["/usr/bin/supervisord", "-c", "/var/www/docker/supervisor.conf"]