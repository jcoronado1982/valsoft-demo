# 🛠️ System Prerequisites

Para ejecutar este proyecto, asegúrate de cumplir con los siguientes requisitos mínimos. El entorno está optimizado para **Linux (Ubuntu/Debian)**.

## 1. Requisitos de Software

- **Docker Desktop / Engine (27+)**: Debe estar en ejecución. Se usa para virtualizar PostgreSQL y el aislamiento del AI Worker.
- **.NET 9 SDK**: Necesario para el Backend y el Orquestador Aspire.
- **Python 3.13**: Para el AI Worker y los servicios MCP.
- **Bun (última versión)**: Para el Frontend (significativamente más rápido que NPM).
  - *Instalar Bun*: `curl -fsSL https://bun.sh/install | bash`

## 2. Configuración Inicial (Primeros Pasos)

Sigue este orden para una instalación exitosa:

1.  **Configuración Local**: Ejecuta `./init-dev.sh` para crear tus archivos `.env` y de configuración de desarrollo.
2.  **Instalación Automática**: Ejecuta `make setup` para instalar todas las dependencias y runtimes necesarios (este script requiere `sudo` para instalar paquetes de sistema si faltan).
3.  **Ejecución**: Usa `make dev` para iniciar el orquestador Aspire.

## 3. Comandos Útiles

- **Iniciar todo**: `make dev`
- **Detener todo**: `make stop`
- **Solo Base de Datos**: `make db`

---
*Maintained by Antigravity AI*

