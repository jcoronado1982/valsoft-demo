import pytest
from unittest.mock import AsyncMock
from src.core.engine import AIEngine
from src.core.models import AIInteraction
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_run_prompt_success(mock_ai_provider):
    # Setup
    mock_db = AsyncMock(spec=AsyncSession)
    engine = AIEngine(mock_ai_provider, mock_db)
    
    mock_interaction = AIInteraction(
        provider="test",
        model_name="test-model",
        prompt="Hello",
        response="World",
        tokens_used=10
    )
    mock_ai_provider.generate.return_value = mock_interaction
    
    # Execute
    result = await engine.run_prompt("Hello", trace_id="123")
    
    # Assert
    assert result.response == "World"
    assert result.trace_id == "123"
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
