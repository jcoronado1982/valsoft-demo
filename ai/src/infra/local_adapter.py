from typing import AsyncGenerator, Any
import ollama
from src.core.ports import AIProvider
from src.core.models import AIInteraction

class LocalProvider(AIProvider):
    def __init__(self, model_name: str = "llama3"):
        self.model_name = model_name
        self.client = ollama.AsyncClient()

    async def generate(self, prompt: str, **kwargs: Any) -> AIInteraction:
        response = await self.client.generate(model=self.model_name, prompt=prompt)
        return AIInteraction(
            provider="ollama",
            model_name=self.model_name,
            prompt=prompt,
            response=response['response'],
            tokens_used=response.get('eval_count', 0),
            additional_info={"total_duration": response.get('total_duration')}
        )

    async def stream(self, prompt: str, **kwargs: Any) -> AsyncGenerator[str, None]:
        async for chunk in await self.client.generate(model=self.model_name, prompt=prompt, stream=True):
            yield chunk['response']
