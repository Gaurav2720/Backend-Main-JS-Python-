# Theory Class: FastAPI Dockerization & GitHub Actions CI/CD Workflow

**Course:** Backend Web Development — Theory Class Practical  
**Topic:** Containerization, Continuous Integration, and Automated Deployment (CI/CD)  
**Student:** Gaurav Bhaskar (`590012457`)  
**Directory:** `TheoryClass/class_docker/`

---

## 1. Practical Overview & Objectives
This comprehensive guide documents the automated containerization and cloud delivery pipeline for a Python **FastAPI** backend service using **Docker**, **Docker Hub Container Registry**, and **GitHub Actions**.

Per coursework instructions, cloud CI/CD pipelines connecting automated webhooks and remote secret vaults are configured through external repository repositories with dedicated secrets. This document details the architectural specification, configuration files, and step-by-step pipeline execution.

---

## 2. Architectural Blueprint

```plaintext
      +------------------------+
      |  Developer Workstation |
      |  git push origin main  |
      +-----------+------------+
                  |
                  v
      +------------------------+
      |   GitHub Repository    |
      |   Triggers CI Workflow |
      +-----------+------------+
                  |
                  v
      +----------------------------------------------------+
      | GitHub Actions Runner (ubuntu-latest)               |
      |                                                    |
      |  1. Checkout code (actions/checkout@v4)            |
      |  2. Set up Python 3.11 & run pytest suite          |
      |  3. Set up Docker Buildx (docker/setup-buildx)     |
      |  4. Authenticate to Docker Hub via GitHub Secrets   |
      |     (DOCKER_USERNAME, DOCKER_PASSWORD)             |
      |  5. Build multi-arch container image               |
      |  6. Tag image (e.g. :latest, :v1.0.0, :commit_sha) |
      |  7. Push image to Docker Hub Registry              |
      +-------------------+--------------------------------+
                          |
                          v
      +----------------------------------------------------+
      | Docker Hub Public / Private Registry               |
      | https://hub.docker.com/r/gauravbhaskar/fastapi-app |
      +----------------------------------------------------+
```

---

## 3. Component 1: FastAPI Application Specification

The core FastAPI application defines production endpoints with Pydantic schemas and health checks:

```python
# main.py
from fastapi import FastAPI, status
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="Coursework Student Management Service",
    version="1.0.0",
    docs_url="/docs"
)

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

@app.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "healthy",
        "service": "student-management-api",
        "version": "1.0.0"
    }

@app.get("/")
def read_root():
    return {"message": "FastAPI CI/CD Containerized Service is Active"}
```

---

## 4. Component 2: Multi-Stage Production Dockerfile

```dockerfile
# Stage 1: Build stage with compiler toolchain
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Minimal runtime image
FROM python:3.11-slim AS runner

WORKDIR /app

# Non-root user security practice
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Copy installed python wheels from builder stage
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . /app

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 5. Component 3: GitHub Actions CI/CD Pipeline (`.github/workflows/docker-ci.yml`)

```yaml
name: FastAPI Docker CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    name: Run Unit Tests & Linting
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt pytest httpx flake8

      - name: Run Linters
        run: flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

      - name: Run Pytest Suite
        run: pytest -v

  build-and-push:
    name: Build & Push Docker Image
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up QEMU (Multi-platform emulation)
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract Metadata (Tags, Labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKER_USERNAME }}/fastapi-student-service
          tags: |
            type=raw,value=latest
            type=sha,format=short

      - name: Build and Push to Registry
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 6. Security & Credentials Management
- **Personal Access Tokens (PAT):** Never store raw Docker Hub account passwords in code. Create a Read/Write scoped Access Token from `Docker Hub -> Account Settings -> Security -> Access Tokens`.
- **GitHub Secrets Configuration:**
  - `DOCKER_USERNAME`: Docker Hub account handle.
  - `DOCKER_PASSWORD`: Docker Hub Personal Access Token (PAT).
  - Secrets are encrypted via libsodium before storage and masked in GitHub Action logs.

---

## 7. Verification & Live Deployment Checklist
- [x] Code pushed to remote repository triggers workflow dispatch.
- [x] Automated test runner executes pytest assertions.
- [x] Docker layer caching via GitHub Actions cache backend (`type=gha`).
- [x] Image tagged with both `:latest` and commit SHA `:sha-xxxxxxx`.
- [x] Image successfully pulled and verified via `docker pull <username>/fastapi-student-service:latest`.
