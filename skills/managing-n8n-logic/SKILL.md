---
name: managing-n8n-logic
description: Скилл управляет логикой и инфраструктурой n8n в Docker на Ubuntu 22.04, обеспечивая деплой, мониторинг и обновление.
---

# Managing n8n Logic

Этот скилл предназначен для управления инстансом n8n, развернутым через Docker Compose на Ubuntu 22.04.

## 1. Quick Operations
Используй эти команды для быстрого управления контейнером:

- **Проверка статуса**: `docker compose ps` (в директории с n8n)
- **Логи**: `docker compose logs -f n8n`
- **Перезапуск**: `docker compose restart n8n`
- **Обновление**: 
  ```bash
  docker compose pull
  docker compose up -d
  ```

## 2. Infrastructure Patterns (Ubuntu 22.04)
При работе с бэкендом n8n придерживайся следующих правил:
- **Persistence**: Все данные должны быть в именованных volumes или примонтированных папках (например, `./n8n_data:/home/node/.n8n`).
- **Environment**: Используй `.env` файл для хранения `N8N_ENCRYPTION_KEY`, `DB_TYPE` и данных для OAuth.
- **Reverse Proxy**: Рекомендуется использовать Nginx Proxy Manager или Traefik в соседних контейнерах.

## 3. Workflow Validation
Перед внесением изменений в логику workflow:
1. Экспортируй текущий workflow через CLI (если доступно) или сохрани JSON.
2. Проверь статус Docker-контейнера.
3. При необходимости внесения правок в БД (Postgres/SQLite), делай бэкап папки данных.

## 4. Troubleshooting
- Если n8n не стартует: проверь права на папку данных `chown -R 1000:1000 ./n8n_data`.
- Если RAM забит: ограничь лимиты в `docker-compose.yml` (`mem_limit: 1g`).
