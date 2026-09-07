# Dockerfile

# ---- Estágio 1: Instalação de Dependências ----
# Usamos uma imagem base do Node.js com a versão LTS (Long Term Support)
FROM node:20-alpine AS deps
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes
COPY package.json package-lock.json ./

# Instala as dependências (incluindo devDependencies para o build)
RUN npm ci

# ---- Estágio 2: Build da Aplicação ----
# Usamos a mesma imagem base para manter a consistência
FROM node:20-alpine AS builder
WORKDIR /app

# Copia as dependências já instaladas do estágio anterior
COPY --from=deps /app/node_modules ./node_modules
# Copia o restante do código da aplicação
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_URL

ARG NEXT_PUBLIC_GOOGLE_AD_CLIENT
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_ABOUT_US
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_DETAILS
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_LEADERBOARD
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_CONTACT_US
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_HOMEPAGE_BANNER
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPES_LEADERBOARD
ARG NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPE_DETAIL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \

    NEXT_PUBLIC_GOOGLE_AD_CLIENT=$NEXT_PUBLIC_GOOGLE_AD_CLIENT \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_ABOUT_US=$NEXT_PUBLIC_GOOGLE_AD_SLOT_ABOUT_US \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_DETAILS=$NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_DETAILS \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_LEADERBOARD=$NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_LEADERBOARD \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_CONTACT_US=$NEXT_PUBLIC_GOOGLE_AD_SLOT_CONTACT_US \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_HOMEPAGE_BANNER=$NEXT_PUBLIC_GOOGLE_AD_SLOT_HOMEPAGE_BANNER \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPES_LEADERBOARD=$NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPES_LEADERBOARD \
    NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPE_DETAIL=$NEXT_PUBLIC_GOOGLE_AD_SLOT_RECIPE_DETAIL

# Executa o script de build
RUN npm run build

# ---- Estágio 3: Imagem Final de Produção ----
# Esta é a imagem final que será executada em produção
FROM node:20-alpine AS runner
WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV production

# Cria um usuário não-root para executar a aplicação (melhor prática de segurança)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os artefatos da build do estágio 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Define o usuário que irá rodar a aplicação
USER nextjs

# Expõe a porta que o Next.js usa por padrão
EXPOSE 3000

# Define o comando para iniciar o servidor Next.js
CMD ["node", "server.js"]