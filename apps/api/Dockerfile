# --- ESTÁGIO 1: Builder ---
FROM php:8.2-fpm AS builder

# Instala dependências do sistema e extensões PHP
RUN apt-get update && \
    apt-get install -y git curl unzip libpq-dev libpng-dev libonig-dev libxml2-dev && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd && \
    pecl install redis && docker-php-ext-enable redis && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copia apenas os ficheiros do composer
COPY composer.json composer.lock ./

# ---- MUDANÇA PRINCIPAL AQUI ----
# Instala as dependências SEM EXECUTAR SCRIPTS para evitar o erro do 'artisan'
RUN composer install --no-interaction --no-dev --optimize-autoloader --no-scripts

# Agora, copia o restante do código da aplicação
COPY . .

# E agora, com o código completo, executa os scripts de otimização
RUN composer dump-autoload --no-dev --optimize

# --- ESTÁGIO 2: Final ---
FROM php:8.2-fpm

# Instalar dependências de execução, incluindo o cliente fastcgi para o healthcheck
RUN apt-get update && \
    apt-get install -y libpq-dev libpng-dev libonig-dev libxml2-dev libfcgi-bin && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd && \
    pecl install redis && docker-php-ext-enable redis && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurações de segurança do PHP
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    sed -i 's/expose_php = On/expose_php = Off/' "$PHP_INI_DIR/php.ini"

WORKDIR /var/www

COPY --from=builder /var/www .

# Ajuste de permissões seguro
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache && \
    find /var/www -type d -exec chmod 755 {} \; && \
    find /var/www -type f -exec chmod 644 {} \;

# Healthcheck corrigido para o FPM que verifica a rota /api/health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD SCRIPT_NAME=/api/health SCRIPT_FILENAME=/var/www/public/index.php REQUEST_METHOD=GET cgi-fcgi -connect 127.0.0.1:9000 | grep -q "ok" || exit 1

EXPOSE 9000
CMD ["php-fpm"]
