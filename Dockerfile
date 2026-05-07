FROM oven/bun:latest AS frontend-builder

# Force rebuild cache invalidation
ARG BUILD_TIME=unknown

WORKDIR /app/frontend

COPY green-cycle-hub/package*.json ./
COPY green-cycle-hub/bun.lockb ./
RUN bun install

COPY green-cycle-hub/tsconfig*.json ./
COPY green-cycle-hub/vite.config.ts ./
COPY green-cycle-hub/tailwind.config.ts ./
COPY green-cycle-hub/postcss.config.js ./
COPY green-cycle-hub/index.html ./
COPY green-cycle-hub/public ./public/
COPY green-cycle-hub/src ./src/
RUN bun run build

FROM python:3.12-slim AS backend

WORKDIR /app

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

COPY green-cycle-hub/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY green-cycle-hub/backend .

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
