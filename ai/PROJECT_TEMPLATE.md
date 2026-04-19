# AI Worker - Project Template (Boilerplate)

This microservice serves as a base for any project requiring autonomous research capabilities and intelligent processing. Forget the past: this structure is designed to be copied and extended for new functionalities.

## 🚀 How to use this template

1.  **Copy the directory**: Simply copy the `ai-worker-python` folder to your new repository.
2.  **Configure Variables**: Create a `.env` file based on `.env.example`:
    - `GEMINI_API_KEY`: Your Google Gemini key.
    - `TAVILY_API_KEY`: Your Tavily search key.
3.  **Define the Contract**: If you need new gRPC methods, edit `proto/ai_service.proto` and regenerate the code with:
    ```bash
    ./venv/bin/python3 -m grpc_tools.protoc -I../proto --python_out=./generated --grpc_python_out=./generated ../proto/ai_service.proto
    ```
4.  **Implement Logic**: Extend the `AIServiceServicer` class in `worker.py` to handle your new business rules.

## 🏗️ Generic Pipeline Architecture

The worker implements a three-stage flow:
1.  **Research (Search)**: Tavily searches for up-to-date information in real-time.
2.  **Reasoning (Gemini)**: AI processes info based on dynamic instructions.
3.  **Security**: Integrated layer against malicious prompt injections.

## 🛠️ Included Tools
- **FastAPI**: Optional REST server for monitoring or triggers.
- **gRPC**: High-performance communication.
- **OpenTelemetry**: Full traceability of AI calls.
- **Docker**: Ready for cloud deployment (Cloud Run, Kubernetes).

---
*This template was created after cleaning and generalizing the original tax compliance engine, making it a general-purpose tool.*
