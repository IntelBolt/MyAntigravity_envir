# IntelBolt Analytics Dashboard (Antigravity OS)

Этот проект является аналитическим дашбордом, построенным на фреймворке Antigravity. Он интегрирует данные из AmoCRM и GA4 через n8n и визуализирует их для эффективного управления бизнесом.

## Структура
- `agents.md` — Глобальные инструкции и роль ведущего архитектора.
- `skills/` — Папка с модульными способностями (Skills).
- `skills/skill-creator/` — Мета-скилл для генерации новых способностей.
- `skills/managing-n8n-logic/` — Управление бэкендом (n8n + Docker).
- `skills/managing-docker-containers/` — Работа с Docker-инфраструктурой.
- `app/` — Исходный код дашборда (Next.js 15).
- `components/` — UI компоненты (Shadcn UI + Framer Motion).

## Технологический стек
- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Shadcn UI.
- **Backend**: n8n Automation (VPS), PostgreSQL.
- **AI**: Google Antigravity / DeepSeek.

## Начало работы (Локально)
```bash
npm install
npm run dev
```

Оригинальный шаблон был создан с помощью [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

