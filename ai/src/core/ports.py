from abc import ABC, abstractmethod
from typing import AsyncGenerator, Protocol
from src.core.models import AIInteraction

class AIProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, **kwargs: any) -> AIInteraction:
        """Generate a complete response from the AI provider."""
        pass

    @abstractmethod
    async def stream(self, prompt: str, **kwargs: any) -> AsyncGenerator[str, None]:
        """Stream response chunks from the AI provider."""
        pass
