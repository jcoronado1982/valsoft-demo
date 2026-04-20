# 🐍 SOP - AI Worker (Python 3.11)

## 🏗️ Architecture and Principles
- **Framework**: Native Python 3.11.
- **Communication**: **gRPC** (Server on port 50051).
- **Design**: Linear processing pipeline (Search -> Filter -> Structure).

## 💻 Engineering Standards
1. **Strict Typing**: Use of Python `typing` to ensure code clarity.
2. **AI Pipelines**:
   - **Tavily**: Advanced web research.
   - **Gemini**: Reasoning and entity extraction.
3. **gRPC Protocol**: Based on `ai_service.proto`. Never modify gRPC logic without first updating the proto files.
4. **Environment**: Dependency management via `requirements.txt` and isolated execution in `venv`.

## 🧪 Testing Stack & QA

### A. Backend Layer (Core & Persistence)
- **Location**: `backend/Inventory.API.IntegrationTests`
- **Technology**: .NET 9 + xUnit + Testcontainers (Postgres 17).
- **Purpose**: Validation of referential integrity, migrations, and Full-Text Search.
- **Execution**:
  ```bash
  dotnet test backend/Inventory.API.IntegrationTests/Inventory.API.IntegrationTests.csproj
  ```

### B. Frontend Layer (UI & Logic)
- **Location**: `frontend/` (specifically `*.spec.ts` files).
- **Technology**: Vitest + JSDOM + Bun Runtime.
- **Purpose**: Verification of Signals, zoneless components, and reactivity.
- **Execution**:
  ```bash
  cd frontend && bun run test
  ```

### C. AI Layer (Intelligence Microservice)
- **Location**: `ai/tests`
- **Technology**: Pytest + gRPC + Instructor.
- **Purpose**: Validation of generative models and multilingual data cleaning.
- **Execution**:
  ```bash
  cd ai && pytest
  ```

---

## 🔄 Execution Modes

### Global Sequential Block
To run all tests one after another (recommended for pre-deployment):
```bash
dotnet test backend/Inventory.API.IntegrationTests/Inventory.API.IntegrationTests.csproj && \
(cd frontend && bun run test) && \
(cd ai && pytest)
```

### Granular Execution
You can run only specific modules by navigating to their respective directories and using the commands listed above.

## 🛰️ Secrets and Configuration
- **Source of Truth**: Local `.env` file.
- **Required Keys**: `GEMINI_API_KEY`, `TAVILY_API_KEY`.
- **Do Not Ask**: Do not report missing keys without first verifying the existence of the `.env` file.

## 🌐 Network & Connectivity
- **Container Networking**: In production (GCP VM), services run with `--network=host`. 
- **Service Discovery**: Hostname resolution (e.g., `ai:50051`) fails in host mode. Always use `localhost:port` or `127.0.0.1:port` for inter-service gRPC communication.
- **Troubleshooting**: If a "Name or service not known" error occurs, verify the `services__ai__grpc__0` environment variable is explicitly set to `http://localhost:50051`.

## 🤖 Quota & Model Optimization
- **Preferred Model**: Use `gemini-2.5-flash-lite` for high-throughput extraction tasks. 
- **Reasoning**: It provides the best balance of latency and quota availability, preventing `429 Resource exhausted` errors seen with older models.

---
> [!IMPORTANT]
> Consult the gRPC documentation to see how to integrate this worker into other microservices.
