# =========================================================================
# ALL-IN-ONE PRODUCTION DOCKERFILE
# Project: Case Management Hearing e-Portal (Order XV-A CPC)
# SVVV B.Tech CSE Semester-VII Major Project (BTCS706N) - Team MP-14
#
# Enables 1-Container Deployment on Docker, AWS ECS, Google Cloud Run,
# Render, Railway, or local development environments.
# =========================================================================

# -------------------------------------------------------------------------
# STAGE 1: COMPILE REACT 19 + VITE PRODUCTION BUNDLE
# -------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /build
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# -------------------------------------------------------------------------
# STAGE 2: PRODUCTION RUNTIME (PYTHON 3.11 ASGI SERVER)
# -------------------------------------------------------------------------
FROM python:3.11-slim AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000 \
    HOST=0.0.0.0

WORKDIR /app

# Install system runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy Backend Application Code & SQLite DB
COPY backend/ ./backend/
COPY run.py .
COPY cmh_portal.db .

# Copy Compiled React Single Page App from Builder Stage
COPY --from=frontend-builder /build/dist ./frontend/dist

# Create necessary directories
RUN mkdir -p /app/uploads/documents /app/logs /app/test-reports

# Expose HTTP Port
EXPOSE 8000

# Health Check Endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Start FastAPI production server
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
