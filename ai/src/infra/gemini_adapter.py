import os
from typing import AsyncGenerator, Any
from google import genai
from src.core.ports import AIProvider
from src.core.models import AIInteraction

class GeminiProvider(AIProvider):
    def __init__(self, api_key: str = os.getenv("GEMINI_API_KEY", "")):
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemini-2.0-flash"

    async def generate(self, prompt: str, **kwargs: Any) -> AIInteraction:
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt
        )
        return AIInteraction(
            provider="gemini",
            model_name=self.model_id,
            prompt=prompt,
            response=response.text,
            tokens_used=response.usage_metadata.total_token_count if response.usage_metadata else 0,
            additional_info={"finish_reason": str(response.candidates[0].finish_reason)}
        )

    async def stream(self, prompt: str, **kwargs: Any) -> AsyncGenerator[str, None]:
        response = self.client.models.generate_content_stream(
            model=self.model_id,
            contents=prompt
        )
        for chunk in response:
            if chunk.text:
                yield chunk.text
