# 📄 Infrastructure Standard Operating Procedure (SOP)

This document centralizes the access, configuration, and deployment procedures for the **Invoice** project infrastructure ecosystem.

## 🚀 General Connectivity

### 1. Google Cloud Platform (GCP)
The main project is `launch-490115`.
- **CLI Authentication**: `gcloud auth login`
- **Current Project**: `gcloud config set project launch-490115`
- **Secrets/Keys**:
  - `GOOGLE_CLIENT_ID`: Located in GCP Console > APIs & Services > Credentials.
  - **Identity**: We use Workload Identity Federation with the pool `github-pool` and provider `github-provider`.

### 2. Vercel (Frontend)
- **Console control**: `npx vercel` or `bun x vercel`.
- **Useful Commands**:
  - `vercel whoami`: Verifies the active session (`jcoronado1982`).
  - `vercel link`: Links the local folder with the project in the cloud.
- **Critical IDs**:
  - `Org ID`: `team_hH3Vpf1wzlLpcZz1eOnbRuzS`
  - `Project ID`: `prj_LePgnlKGtvlL9uUwUcC6ive50Kbr`
  - `Project Name`: `invoice-frontend`

### 3. Neon (Database)
- **Console control**: `neonctl` (installed via Bun).
- **Production Project**: `invoice-db-prod` (ID: `icy-hill-74386029`).
- **Commands**:
  - `neonctl auth`: Start interactive session.
  - `neonctl connection-string --project-id icy-hill-74386029 --pooled`: Get connection URL.

### 4. GitHub Actions (CI/CD)
- **Console control**: `gh cli`.
- **Secret Management**:
  - `gh secret list`: See configured secrets.
  - `gh secret set VARIABLE_NAME`: Set new value.
- **List of 11 Mandatory Secrets**:
  `GCP_PROJECT_ID`, `GCP_PROJECT_NUMBER`, `GCP_REGION`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`, `GEMINI_API_KEY`, `TAVILY_API_KEY`, `GOOGLE_CLIENT_ID`, `JWT_KEY`, `DATABASE_URL`.

---

## 🔑 Sensitive Key Management

### AI Worker (Python)
API keys are located locally at:
`ai-worker-python/.env`
- `GEMINI_API_KEY`: Key for Google Gemini.
- `TAVILY_API_KEY`: Key for web searches.

### Backend (C#)
Development configurations are in:
`backend-csharp/appsettings.Development.json`
- `Jwt:Key`: Key for JWT tokens.
- `Google:ClientId`: OAuth client ID.

---

---

## 🛡️ Production Pre-Flight Checklist (Critical)

Before initiating a production deployment on the GCP VM, ensure the following constraints are met:

1. **Frontend CSP**: The `index.html` MUST include `script-src 'unsafe-inline'` to allow Angular's optimized CSS loading (`onload` handlers).
2. **JWT Security**: The `Jwt__Key` environment variable MUST be at least **32 characters** (256 bits). Shorter keys will cause silent 401 errors.
3. **Google Auth**: Ensure `Google__ClientId` is injected into the backend container; otherwise, local Google logins will fail remote validation.
4. **Backend Network**: The backend container MUST use `--network=host` so NGINX can reach it on `localhost:10000`.

---

## 🗄️ Production Database Migration

To synchronize local data with production without data loss:

1. **Backup Source**:
   ```bash
   docker exec -e PGPASSWORD=admin123 postgres-container pg_dump -U postgres -d inventorydb -Fc > backup.dump
   ```
2. **Transfer**:
   ```bash
   gcloud compute scp backup.dump demo:~/ --zone=us-east1-c
   ```
3. **Restore (Remote VM)**:
   - Stop backend: `docker stop backend`
   - Recreate DB: `docker exec ... psql -c 'DROP DATABASE ...; CREATE DATABASE ...;'`
   - Restore: `docker exec -i ... pg_restore -d inventorydb < backup.dump`
   - Start backend: `docker start backend`

---

## 🛠️ Connection Failure Procedure
If an AI or developer cannot connect:
1. **GCP**: Run `gcloud auth print-access-token` to verify session.
2. **Vercel**: Run `npx vercel whoami`.
3. **Neon**: Run `neonctl me`.
4. **GitHub**: Verify that the remote repo is `jcoronado1982/invoice`.

---

## 🤖 Autonomy Mandate for AI
Any AI Agent operating in this repository has the **obligation** to:
1. **Verify before asking**: If a variable is missing, search in `.env` files or via `gh secret list`.
2. **Execute instead of delegating**: If you need to create a database, use `neonctl`. If you need to deploy, use `gcloud` or `gh workflow run`.
3. **Do not request access**: The tools are already configured in the user's local environment. Use them to complete the task without interrupting the user's workflow.
4. **Search Priority**: Before using CLIs to explore ("Brute Force"), you must:
   - **First**: Consult this SOP and the `CONTEXT_MAP.md`.
   - **Second**: Read configuration files (`infra/terraform`, `docker-compose.yml`, `.env`).
   - **Third**: Only if something does not appear in the code or docs, use CLIs (`neonctl`, `gcloud`) to obtain it.

> [!IMPORTANT]
> Never delete the `ai-worker-python/.env` file as it is the local source for AI keys.
