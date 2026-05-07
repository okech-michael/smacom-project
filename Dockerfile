FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY green-cycle-hub/package*.json ./
COPY green-cycle-hub/package-lock.json ./
COPY green-cycle-hub/bun.lockb ./
RUN npm ci

COPY green-cycle-hub .
RUN npm run build

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
COPY --from=frontend-builder /app/frontend/dist ./frontend-dist

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
