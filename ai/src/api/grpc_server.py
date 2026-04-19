import grpc
import asyncio
from src.generated import ai_service_pb2, ai_service_pb2_grpc
from src.core.engine import AIEngine
from src.api.dependencies import get_ai_provider
from src.core.db import get_session

class AIServiceServicer(ai_service_pb2_grpc.AIServiceServicer):
    async def GenerateResponse(self, request, context):
        provider = get_ai_provider(request.provider or "gemini")
        async for db in get_session():
            engine = AIEngine(provider, db)
            interaction = await engine.run_prompt(request.prompt)
            return ai_service_pb2.AIResponse(
                content=interaction.response,
                tokens_used=interaction.tokens_used,
                model_name=interaction.model_name
            )

async def serve_grpc():
    server = grpc.aio.server()
    ai_service_pb2_grpc.add_AIServiceServicer_to_server(AIServiceServicer(), server)
    server.add_insecure_port('[::]:50051')
    await server.start()
    await server.wait_for_termination()
