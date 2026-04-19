from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.engine import AIEngine
from src.api.dependencies import get_ai_provider, get_db_session
from src.core.models import AIInteraction

router = APIRouter()

@router.post("/generate", response_model=AIInteraction)
async def generate_response(
    prompt: str,
    provider: str = "gemini",
    x_trace_id: str = Header(None),
    db: AsyncSession = Depends(get_db_session)
):
    ai_provider = get_ai_provider(provider)
    engine = AIEngine(ai_provider, db)
    return await engine.run_prompt(prompt, trace_id=x_trace_id)
