import pytest
import asyncio
from unittest.mock import AsyncMock
from src.core.ports import AIProvider

@pytest.fixture
def mock_ai_provider():
    provider = AsyncMock(spec=AIProvider)
    return provider

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
