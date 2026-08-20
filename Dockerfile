# ==========================================
# Stage 1: Install PHP Dependencies
# ==========================================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts


# ==========================================
# Stage 2: Build Frontend Assets
# ==========================================
FROM node:20 AS frontend

WORKDIR /app

COPY . .

COPY --from=vendor /app/vendor ./vendor

RUN npm install --legacy-peer-deps --no-audit --no-fund

RUN npm run build


# ==========================================
# Stage 3: Production Image
# ==========================================
FROM php:8.4-apache

WORKDIR /var/www/html


# Install PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        opcache \
    && rm -rf /var/lib/apt/lists/*


# Apache modules
RUN a2enmod rewrite setenvif && \
    echo 'SetEnvIf X-Forwarded-Proto "https" HTTPS=on' >> /etc/apache2/apache2.conf


# Copy application
COPY . /var/www/html

COPY --from=vendor /app/vendor /var/www/html/vendor

COPY --from=frontend /app/public/build /var/www/html/public/build


# Permissions
RUN chown -R www-data:www-data \
        /var/www/html/storage \
        /var/www/html/bootstrap/cache && \
    chmod -R 775 \
        /var/www/html/storage \
        /var/www/html/bootstrap/cache


# Laravel public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
        /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
        /etc/apache2/apache2.conf \
        /etc/apache2/conf-available/*.conf && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf


# Configure Apache to bind to Render's dynamic $PORT (defaulting to 80 if not set)
ENV PORT=80
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf && \
    sed -i 's/:80/:${PORT}/g' /etc/apache2/sites-available/*.conf


# Startup script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh


ENTRYPOINT ["docker-entrypoint.sh"]