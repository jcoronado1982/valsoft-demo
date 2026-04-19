# 2026 Best Practice: High-performance Python image for AI Worker
# Build Stage
FROM python:3.13-alpine AS builder

WORKDIR /app

# System dependencies for gRPC and C-extensions
RUN apk add --no-cache gcc musl-dev libffi-dev

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Runtime Stage
FROM python:3.13-alpine AS final

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY src/ src/
COPY protos/ protos/
COPY *.py ./
COPY .env ./

# Regenerate gRPC stubs inside the container to match the installed runtime
RUN mkdir -p generated
RUN python -m grpc_tools.protoc -I./protos --python_out=generated --grpc_python_out=generated protos/ai_service.proto

# Use non-root user for security
RUN adduser -D appuser && chown -R appuser /app
USER appuser

# Production Configuration
ENV PORT=50051
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 50051
ENTRYPOINT ["python", "worker.py"]
