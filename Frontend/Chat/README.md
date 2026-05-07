# Онлайн чат

Real-time чат на SignalR с поддержкой комнат, списка участников и Redis-кэшированием.

## Стек

**Backend:** ASP.NET Core 8 + SignalR + StackExchange.Redis  
**Frontend:** React 19 + Vite + Chakra UI + Tailwind CSS v4  
**Инфраструктура:** Redis, Docker

## Локальный запуск

### Без Docker

1. **Redis** — должен быть доступен на `localhost:6379`
2. **Backend:**
   ```bash
   cd Backend/Chat/Chat
   dotnet run
   ```
3. **Frontend:**
   ```bash
   cd Frontend/Chat
   npm install
   npm run dev
   ```
4. Открыть `http://localhost:5173`

### Через Docker

```bash
docker compose up -d
```

Открыть `http://localhost:5173` — nginx проксирует SignalR WebSocket на backend, Redis запущен автоматически.

## Архитектура

```
Пользователь
    │
    ▼
http://localhost:5173
    │
    ├── / → nginx/Vite → index.html (React SPA)
    │
    └── /chat → прокси → backend:8080 (SignalR Hub)
                              │
                              └── redis:6379 (кэш)
```

### Redis хранит

- `{ConnectionId}` → `UserConnection` (имя + комната)
- `room:{chatRoom}:users` → список пользователей в комнате

## Функции

- Комнаты чата с произвольными названиями
- Список участников онлайн
- Таймстемпы сообщений
- Автоматическое переподключение при обрыве связи
- Валидация полей перед входом
- Автофокус и отправка по Enter
