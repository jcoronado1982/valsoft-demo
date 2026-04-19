import os
from functools import lru_cache
from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.ports import AIProvider
from src.core.db import get_session
from src.infra.gemini_adapter import GeminiProvider
from src.infra.local_adapter import LocalProvider

@lru_cache()
def get_ai_provider(provider_name: str = "gemini") -> AIProvider:
    if provider_name == "ollama":
        return LocalProvider()
    return GeminiProvider(api_key=os.getenv("GEMINI_API_KEY", ""))

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session
