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

## 🤖 Proactive Mandate
You have access to `pip`, `venv`, and `python`. If you need to regenerate protos or reinstall dependencies, **do it yourself**. Do not ask for permission to execute technical commands that are already under your control.

---
> [!IMPORTANT]
> Consult the gRPC documentation to see how to integrate this worker into other microservices.
