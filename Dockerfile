FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV DEBUG=true

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

# Frontend dist from git (pre-built)
COPY green-cycle-hub/backend/frontend-dist ./frontend-dist

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
