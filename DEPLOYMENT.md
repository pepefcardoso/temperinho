Salva front-package-lock.json → apps/front/package-lock.json e admin-package-lock.json → apps/admin/package-lock.json.

composer.lock não existe e não consigo gerar aqui (sandbox sem acesso a packagist.org). Roda local, dentro de apps/api:

docker run --rm -v "$(pwd)":/app -w /app composer:2 composer install --no-dev --ignore-platform-reqs

Passo a passo na VPS

# 1. DNS (Cloudflare) — 3 registros A, proxied, apontando pro IP da VPS
#    temperinho / api.temperinho / admin.temperinho

# 2. clone via deploy key (§8.4)
mkdir -p /root/projects/temperinho && cd /root/projects/temperinho
git clone git@github.com:<seu-usuario>/temperinho.git .

# 3. gerar APP_KEY antes de subir
docker run --rm php:8.2-cli php -r "echo 'base64:'.base64_encode(random_bytes(32));"
# cola o resultado em APP_KEY no .env.prod

cp .env.prod.example .env.prod
nano .env.prod   # preenche tudo

# 4. build + up
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 5. migrations (sem seed de dados fake)
docker exec temperinho-api php artisan migrate --force
docker exec temperinho-api php artisan db:seed --class=UserSeeder --force

# 6. índices do meilisearch
docker exec temperinho-api php artisan scout:import "App\\Models\\Recipe"
docker exec temperinho-api php artisan scout:import "App\\Models\\Post"

# 7. scheduler (crontab -e no host)
* * * * * docker exec temperinho-api php artisan schedule:run >> /dev/null 2>&1

LOG_CHANNEL=stack → stderr (logs aparecerem em docker logs)
remover security-headers@file do router temperinho-api no Traefik (duplicidade com o SecureHeaders.php do Laravel)