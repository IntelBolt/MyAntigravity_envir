---
name: managing-docker-containers
description: Скилл управляет жизненным циклом Docker-контейнеров, сетями и томами, обеспечивая очистку ресурсов и мониторинг системы.
---

# Managing Docker Containers

Этот скилл предназначен для управления Docker-инфраструктурой на Ubuntu 22.04.

## 1. Resource Hygiene
Используй эти команды для поддержания чистоты системы:
- **Очистка неиспользуемых ресурсов**: `docker system prune -a --volumes`
- **Просмотр веса контейнеров/образов**: `docker system df`
- **Удаление "битых" образов (dangling)**: `docker image prune`

## 2. Container Management
- **Просмотр всех контейнеров**: `docker ps -a`
- **Просмотр потребления ресурсов**: `docker stats`
- **Перезапуск всех контейнеров в compose**: `docker compose restart`

## 3. Networking & Volumes
- **Список сетей**: `docker network ls`
- **Список волюмов**: `docker volume ls`
- **Инспекция сети**: `docker network inspect [network_name]`

## 4. Best Practices
- **Logging**: Всегда проверяй размер лог-файлов в `/var/lib/docker/containers/`.
- **Limits**: Используй `cpus` и `memory` лимиты в `docker-compose.yml`.
- **Security**: Не запускай контейнеры от root, если это не требуется.
