FROM php:8.2-fpm

# Instala pacotes e extensões PHP
RUN apt-get update && apt-get install -y \
    git unzip curl zip libpng-dev libonig-dev libxml2-dev libzip-dev \
    libssl-dev pkg-config gnupg2 gnupg npm nodejs nginx supervisor \
    ca-certificates \
    && update-ca-certificates \
    && pecl install mongodb-1.18.0 \
    && docker-php-ext-enable mongodb \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Instala dependências PHP
RUN composer install --no-dev --optimize-autoloader

# Instala dependências frontend
RUN cd resources/js && npm install && npm run build

# Copia arquivos de configuração
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/supervisord.conf /etc/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
