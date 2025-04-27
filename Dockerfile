# syntax=docker/dockerfile:1

FROM php:8.2-fpm-alpine AS stage-1

# Atualiza os repositórios e instala dependências
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

# Copia o Composer do container oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www

# Copia o restante dos arquivos da aplicação
COPY . .

# Garante que as pastas necessárias existem
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache

# Dá permissão nas pastas que o Laravel precisa
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Permissão extra: às vezes precisa dar permissão pro nginx ou php-fpm
RUN chown -R www-data:www-data /var/www

# Exponha a porta que o nginx vai usar
EXPOSE 80

# Comando padrão para o PHP-FPM (mas atenção: depois você precisa configurar o Nginx também)
CMD ["/usr/bin/supervisor", "-c", "/var/www/docker/supervisor.conf"]