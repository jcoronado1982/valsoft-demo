import asyncio
import uvicorn
from fastapi import FastAPI
from src.api.rest import router
from src.api.grpc_server import serve_grpc
from src.infra.otel_config import setup_otel
from src.core.db import init_db

app = FastAPI(title="AI Worker Senior 2026")
app.include_router(router)

setup_otel(app)

@app.on_event("startup")
async def on_startup():
    await init_db()

async def run_fastapi():
    config = uvicorn.Config(app, host="0.0.0.0", port=8000)
    server = uvicorn.Server(config)
    await server.serve()

async def main():
    await asyncio.gather(
        run_fastapi(),
        serve_grpc()
    )

if __name__ == "__main__":
    asyncio.run(main())
