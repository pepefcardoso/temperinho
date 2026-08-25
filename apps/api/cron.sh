#!/bin/bash
# Rotina diária de backups e renovação SSL
docker-compose run --rm backup
docker-compose run --rm certbot renew
docker-compose restart nginx
