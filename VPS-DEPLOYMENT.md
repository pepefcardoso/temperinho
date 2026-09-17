# 1. lockfiles — gerar local, não na VPS (evita instalar node/composer no host)

docker run --rm -v "$(pwd)/apps/front":/app -w /app node:20-alpine npm i --package-lock-only
docker run --rm -v "$(pwd)/apps/admin":/app -w /app node:20-alpine npm i --package-lock-only
docker run --rm -v "$(pwd)/apps/api":/app -w /app composer:2 composer install --no-dev --ignore-platform-reqs

# commitar os 3 lockfiles antes do push

# 2. DNS (Cloudflare) — 3 registros A, proxied, IP 169.58.128.132

# temperinho.pepefcardoso.dev / api.temperinho.pepefcardoso.dev / admin.temperinho.pepefcardoso.dev

# 3. clone via deploy key

mkdir -p /root/projects/temperinho && cd /root/projects/temperinho
git clone <git@github.com>:<usuario>/temperinho.git .

# 4. .env.prod

cp .env.prod.example .env.prod
docker run --rm php:8.2-cli php -r "echo 'base64:'.base64_encode(random_bytes(32));"
nano .env.prod   # APP_KEY, DB_PASSWORD, MEILISEARCH_KEY, AWS_*, GOOGLE_CLIENT_*, ADMIN_*

# 5. build + up

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 6. migrations (sem seed de dados fake)

docker exec temperinho-api php artisan migrate --force
docker exec temperinho-api php artisan db:seed --class=UserSeeder --force

# 7. índices meilisearch (Company estava faltando no plano original)

docker exec temperinho-api php artisan scout:import "App\\Models\\Recipe"
docker exec temperinho-api php artisan scout:import "App\\Models\\Post"
docker exec temperinho-api php artisan scout:import "App\\Models\\Company"

# 8. scheduler (crontab -e no host)

* * * * * docker exec temperinho-api php artisan schedule:run >> /dev/null 2>&1

# 9. confirmar worker de fila subiu e está consumindo

docker logs -f temperinho-queue-worker

# 10. teste de restore do backup R2 — primeiro Postgres real do host, gatilho do §7 pendente

docker exec temperinho-postgres pg_dump -U temperinho temperinho > /tmp/restore-test.sql

Depois disso: checar docker inspect --format='{{json .State.Health.Log}}' <container> em cada serviço antes de considerar no ar — healthcheck ruim tira o subdomínio do ar silenciosamente atrás de um 404 genérico do Traefik.

Manual, fora de código:

DNS (Cloudflare dashboard) — 3 registros A, proxied, IP 169.58.128.132: temperinho, api.temperinho, admin.temperinho na zona pepefcardoso.dev.
.env.prod na VPS — não existe conector de SSH/Cloudflare nesta sessão pra fazer por você. Roda na VPS:

cd /root/projects/temperinho
cp .env.prod.example .env.prod
docker run --rm php:8.2-cli php -r "echo 'base64:'.base64_encode(random_bytes(32));"
docker run --rm alpine sh -c 'head -c32 /dev/urandom | base64'   # MEILISEARCH_KEY e DB_PASSWORD
nano .env.prod

Preencher: APP_KEY, DB_PASSWORD, MEILISEARCH_KEY, AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_BUCKET (cobre S3 e SES), GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET, ADMIN_*.
