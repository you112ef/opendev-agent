FROM python:3.11-slim as backend-builder

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .

# Frontend build stage
FROM node:20-alpine as frontend-builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy application
COPY backend .

# Copy built frontend
COPY --from=frontend-builder /app/.next .next
COPY --from=frontend-builder /app/public public
COPY --from=frontend-builder /app/package*.json ./

# Install frontend deps for runtime
RUN npm install --production

EXPOSE 8000 3000

CMD ["python", "main.py"]
