# Monorepo - IA Platform (Template)

> [!IMPORTANT]
> **GUIDE FOR AI**: Read [CONTEXT_MAP.md](CONTEXT_MAP.md) first to understand the complete architecture.

Modular platform with integrated generic AI engine, built with **Top Tier 2026** standards.

## 💻 System Requirements

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| **OS** | Linux (Ubuntu/Debian recommended) | Main development environment |
| **Docker** | Engine 27+ / Desktop | DB Virtualization & AI isolation |
| **.NET SDK** | 9.0 | Backend & Aspire Orchestration |
| **Python** | 3.13 | AI Worker & MCP Services |
| **Bun** | latest | Frontend (replaces Node/NPM) |

## 🚀 Getting Started (Quick Start)

If you just cloned this repository, follow these steps to set up your local environment:

1.  **Initialize Config**: Create your local `.env` and `appsettings` files from templates:
    ```bash
    chmod +x init-dev.sh
    ./init-dev.sh
    ```
2.  **Add Secrets**: Edit the newly created `.env` and `backend/Inventory.API/appsettings.Development.json` files with your own API keys (Gemini, Tavily, Google).
3.  **One-Click Install**: Run the setup script to install all runtimes and packages:
    ```bash
    make setup
    ```
4.  **Run with Aspire**: Start the entire project (Dashboard included):
    ```bash
    make dev
    ```

## 🛠️ Troubleshooting

- **Docker Permission Denied**: Ensure your user is in the `docker` group: `sudo usermod -aG docker $USER`.
- **Port 5092/4200 busy**: Run `make stop` to clear lingering processes.
- **Database Connection**: Ensure the Docker container `inventory_db` is running via `docker ps`.
- **Styles missing in Production**: If the site loads without styles on the live domain but works on localhost, check the `Content-Security-Policy` in `index.html`. It must allow `'unsafe-inline'` for `script-src` to support Angular's optimized CSS loading strategy.

## 📂 Project Structure

- **/frontend**: Angular 21 Application (Zoneless, Signals, Signal Forms).
- **/backend**: C# .NET 9 Backend (Inventory Domain, Clean Architecture + Vertical Slices).
- **/ai**: AI Microservice (Python, gRPC).
- **/infra**: Infrastructure, CI/CD and Governance ([infra/GOVERNANCE.md](infra/GOVERNANCE.md)).

## 🧠 AI Agent Interoperability (MCP)

This project includes a **Model Context Protocol (MCP)** server that allows AI agents (like Claude or Gemini) to interact directly with the platform.


---
## 🤖 AI Agent Orientation (Start Here)

If you are an AI working on this project, you **MUST** follow this order to understand the system:

1.  **Governance**: Read [infra/GOVERNANCE.md](infra/GOVERNANCE.md) to understand how to handle branches and versions.
2.  **Infrastructure and Secrets**: Read [infra/INFRASTRUCTURE_SOP.md](infra/INFRASTRUCTURE_SOP.md). All GCP, Vercel, Neon, and Gemini keys are here. **Do not say you don't have the keys without checking this file.**
3.  **Components**: Each subfolder has its own README with testing and development instructions:
    - [frontend/README.md](frontend/README.md)
    - [backend/Inventory.API/README.md](backend/Inventory.API/README.md)
    - [ai/README.md](ai/README.md)
4.  **Language Policy**: All code, comments, and documentation MUST be in **English**. (See [infra/GOVERNANCE.md](infra/GOVERNANCE.md#64-language-policy)).

**NOTICE TO AI**: You have authenticated CLIs (`gcloud`, `gh`, `neonctl`). Be proactive. If something doesn't work, fix it using the available tools. Do not ask the user to do what you can execute.

---
## 🚀 Production Deployment

For deploying the platform to **Google Cloud (launch.lat)**, refer to the following documentation:

- **Deployment Guide**: [infra/DEPLOYMENT_GUIDE.md](infra/DEPLOYMENT_GUIDE.md) — Step-by-step instructions for build and deploy.
- **Infrastructure SOP**: [infra/INFRASTRUCTURE_SOP.md](infra/INFRASTRUCTURE_SOP.md) — Pre-flight checks and Database migration procedures.

---
Designed and developed with high quality and maintainability standards.
