FROM php:8.2-fpm AS backend

# Instalar dependências
RUN apt-get update && apt-get install -y \
    git unzip curl zip libpng-dev libonig-dev libxml2-dev libzip-dev \
    libssl-dev pkg-config gnupg2 gnupg npm nodejs nginx supervisor \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar diretório da aplicação
WORKDIR /var/www

# Copiar arquivos da aplicação
COPY . .

# Instalar dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Instalar dependências do Inertia/React e build
RUN npm install && npm run build

# Ajustar permissões
RUN chown -R www-data:www-data /var/www

# Copiar configuração do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiar configuração do supervisord (para rodar Nginx e PHP juntos)
RUN echo "[supervisord]\nnodaemon=true\n\n[program:php-fpm]\ncommand=php-fpm\n\n[program:nginx]\ncommand=nginx -g 'daemon off;'" > /etc/supervisor/conf.d/supervisord.conf

# Expor a porta padrão HTTP
EXPOSE 80

# Start supervisor (Nginx + PHP-FPM)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]