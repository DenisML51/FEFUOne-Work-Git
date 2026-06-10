# MOL Assistant

ИИ-ассистент для материально ответственного лица (МОЛ): обзорный дашборд по ТМЦ,
инвентаризациям и актам плюс правый ИИ-помощник.

## Стек

- **Frontend** — Vite + React 19 + TypeScript + Tailwind v4 + TanStack Query + i18next (RU/EN).
- **Backend** — микросервисы на FastAPI (async), один общий `httpx.AsyncClient` на процесс.
- **Инфраструктура** — API Gateway, Qdrant (вектора), Airflow 3.x (LocalExecutor) на Postgres.

## Архитектура

```
frontend (nginx) ─▶ gateway ─┬─▶ auth        (заглушка сессии)
                             ├─▶ ai-agent    (чат, заглушка ответа; готов к Anthropic + Qdrant)
                             └─▶ ingestor    (триггер пайплайнов Airflow)
                                   └─▶ airflow (api-server / scheduler / dag-processor) + postgres
qdrant — векторное хранилище для RAG ai-agent
```

Фронтенд ходит только в `gateway` по `/api/*`. Gateway проксирует:
`/api/auth/*`, `/api/agent/*`, `/api/ingest/*`.

## Структура

```
frontend/
  src/ui/          переиспользуемые примитивы (Card, Button, Badge, ProgressBar, …)
  src/features/    функциональные модули (sidebar, workspace, assistant)
  src/i18n/        локали ru/en
  src/data/        мок-данные дашборда
services/
  gateway/  auth/  ai-agent/  ingestor/
  ingestor/airflow/dags/   DAG mol_ingest
docker-compose.yml
```

## Запуск

### Локальная разработка

```bash
# фронтенд
cd frontend && npm install && npm run dev      # http://localhost:5173

# бэкенд (пример для одного сервиса)
cd services/gateway && uv pip install -r pyproject.toml
uvicorn app.main:app --reload --port 8080
```

Vite проксирует `/api` на `VITE_PROXY_TARGET` (по умолчанию `http://localhost:8080`).

### Весь стек в Docker

```bash
cp .env.example .env
docker compose up --build
```

| Сервис   | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:8081        |
| Gateway  | http://localhost:8080/api/health |
| Airflow  | http://localhost:8082        |
| Qdrant   | http://localhost:6333/dashboard  |

## Заметки

- **Авторизация** — заглушка (`auth` отдаёт фиктивную сессию), логина на фронте нет.
- **ИИ-агент** — `/chat` возвращает детерминированную заглушку; контракт совпадает с боевым,
  ключ `ANTHROPIC_API_KEY` и `QDRANT_URL` уже проброшены для последующей реализации RAG.
- `AIRFLOW_IMAGE` в `.env` позволяет зафиксировать версию Airflow под окружение.
- Дизайн воспроизводит макет `image.png` 1:1; `image copy*.png` использованы как референс
  отдельных элементов (статус-бейджи, карточки загрузки, кольцевой прогресс).
