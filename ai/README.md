# 🐍 AI Worker - Generic Template

This microservice is a generic search and processing engine using AI (Tavily + Gemini) via gRPC.

## 🛠️ Development and Testing
- **Installation**: `./setup.sh` at the root (creates the venv).
- **Local Execution**: `make dev` from the root or `python worker.py` within the folder with the venv active.
- **Testing**:
  - Unit: `pytest`
  - gRPC: Proto files are in `../proto/`.

## 🤖 For AI Agents
- **Secrets**: API keys (`GEMINI_API_KEY`, `TAVILY_API_KEY`) are in the local `.env` file. **DO NOT** assume they don't exist without checking that file.
- **Global Configuration**: See [../infra/INFRASTRUCTURE_SOP.md](../infra/INFRASTRUCTURE_SOP.md).
- **Governance**: Follow the rules in [../infra/GOVERNANCE.md](../infra/GOVERNANCE.md).

## 🚀 Deployment
It is automatically deployed to Google Cloud Run via GitHub Actions.
