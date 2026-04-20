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

## 🧪 Testing and Quality
- **Framework**: `pytest`.
- **Execution**: `pytest` within the directory.
- **Mocking**: Mocking external API calls (Gemini/Tavily) for CI/CD tests.

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
