import grpc
from concurrent import futures
import json
import os
import sys
import requests

from dotenv import load_dotenv

# Add src to path for engine import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from core.engine import ResearchAgent
from extractor import extraer_datos_producto

# Load environment variables from the same directory as this script (Force Override)
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(dotenv_path=env_path, override=True)
print(f"   📂 [DIAGNOSTIC] Environment loaded from: {env_path}")
print(f"   📂 [DIAGNOSTIC] File exists: {os.path.exists(env_path)}")

# Add proto generated path to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), 'generated'))

import ai_service_pb2
import ai_service_pb2_grpc

# ─── Security Layer (2026 Hardening) ─────────────────────────────
def is_prompt_safe(prompt: str) -> bool:
    """Detect common Prompt Injection patterns."""
    BLOCK_LIST = [
        "ignore previous instructions",
        "forget everything",
        "system prompt",
        "you are now",
        "jailbreak",
        "DAN mode",
        "ignore the rules"
    ]
    p_lower = prompt.lower()
    return not any(phrase in p_lower for phrase in BLOCK_LIST)

class SecurityException(Exception):
    pass

# ─── API Keys ────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash-lite"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


# ─── Gemini via REST API ─────────────────────────────────────────
def call_gemini(prompt: str) -> str:
    """Call Gemini API directly via REST with Security Guard."""
    if not is_prompt_safe(prompt):
        print(f"  [SECURITY] Blocked potential Prompt Injection: {prompt[:50]}...")
        raise SecurityException("Malicious content detected in prompt.")

    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 4096,
        }
    }
    
    response = requests.post(GEMINI_URL, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    
    data = response.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]


def perform_search(query: str) -> str:
    """Search for information using Tavily REST API."""
    print(f"  [Tavily] Search Query: {query}")
    
    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "search_depth": "advanced",
        "max_results": 10,
        "include_raw_content": False,
    }
    
    response = requests.post("https://api.tavily.com/search", json=payload, timeout=30)
    response.raise_for_status()
    results = response.json()
    
    combined = ""
    for r in results.get("results", []):
        combined += f"\n--- Source: {r.get('url', 'N/A')} ---\n"
        combined += f"Title: {r.get('title', 'N/A')}\n"
        combined += f"Content: {r.get('content', 'N/A')}\n"
    
    print(f"  [Tavily] Found {len(results.get('results', []))} results")
    return combined


# ─── gRPC Service ────────────────────────────────────────────────────
class AIServiceServicer(ai_service_pb2_grpc.AIServiceServicer):
    def ProcessQuery(self, request, context):
        query = request.query
        instruction = request.instruction
        
        print(f"\n{'='*60}")
        print(f"📥 Generic AI Query: {query}")
        print(f"📋 Instruction: {instruction}")
        print(f"{'='*60}")
        
        try:
            # Step 1: Search raw data
            raw_data = perform_search(query)
            
            # Step 2: Formulate prompt for Gemini
            prompt = f"""You are a highly efficient research assistant.
            
TASK: Process the following raw information based on the user's INSTRUCTION.

INSTRUCTION: {instruction}

COLLECTED INFORMATION:
{raw_data}

Respond concisely and directly following the instruction. If you do not find relevant information, indicate it clearly."""

            # Step 3: Process with Gemini
            answer = call_gemini(prompt)
            
            print(f"✅ Query processed successfully")
            print(f"{'='*60}\n")
            
            return ai_service_pb2.QueryResponse(answer=answer, raw_data=raw_data)
            
        except Exception as e:
            print(f"❌ Error processing query: {e}")
            return ai_service_pb2.QueryResponse(answer=f"Error: {str(e)}", raw_data="")

    def AnalyzeCompany(self, request, context):
        """Corporate Research Agent — Tavily + Gemini pipeline."""
        legal_name = request.legal_name
        country = request.country or "Colombia"  # Hardcoded default

        print(f"\n{'='*60}")
        print(f"🏢 AnalyzeCompany RPC — {legal_name} ({country})")
        print(f"{'='*60}")

        try:
            agent = ResearchAgent(TAVILY_API_KEY, GEMINI_API_KEY)
            result = agent.analyze_company(legal_name, country)

            print(f"✅ CompanyResponse built successfully")
            return ai_service_pb2.CompanyResponse(**result)

        except Exception as e:
            print(f"❌ Error in AnalyzeCompany: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Research Agent error: {str(e)}")
            # Return proto defaults on error
            return ai_service_pb2.CompanyResponse(
                legal_name=legal_name,
                country=country,
                official_data_source=f"Error: {str(e)}"
            )

    def DiscoverCompanies(self, request, context):
        """Company Discovery — find active companies by country."""
        country = request.country or "Colombia"
        limit = request.limit or 10

        print(f"\n{'='*60}")
        print(f"🔎 DiscoverCompanies RPC — {country} (limit: {limit})")
        print(f"{'='*60}")

        try:
            agent = ResearchAgent(TAVILY_API_KEY, GEMINI_API_KEY)
            result = agent.discover_companies(country, limit)

            # Build repeated CompanyResponse
            companies = [
                ai_service_pb2.CompanyResponse(**comp)
                for comp in result["companies"]
            ]

            print(f"✅ DiscoverResponse built: {len(companies)} companies")
            return ai_service_pb2.DiscoverResponse(
                companies=companies,
                total_found=result["total_found"],
                search_source=result["search_source"],
            )

        except Exception as e:
            print(f"❌ Error in DiscoverCompanies: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Discovery error: {str(e)}")
            return ai_service_pb2.DiscoverResponse(
                companies=[],
                total_found=0,
                search_source=f"Error: {str(e)}",
            )

    def ExtractProduct(self, request, context):
        """Product Extraction — raw text to structured JSON."""
        print(f"\n{'='*60}")
        print(f"📦 ExtractProduct RPC — Input: {request.raw_text}")
        print(f"{'='*60}")

        try:
            # Usar el extractor basado en Instructor
            resultado = extraer_datos_producto(request.raw_text)

            # Insertar la marca en los atributos para que se guarde en la DB
            atributos = resultado.atributos
            atributos["brand"] = resultado.marca

            print(f"✅ Product extracted successfully: {resultado.nombre_limpio} (Marca: {resultado.marca}, Cat: {resultado.categoria_sugerida})")
            return ai_service_pb2.ProductResponse(
                nombre_limpio=resultado.nombre_limpio,
                categoria_sugerida=resultado.categoria_sugerida, 
                atributos_json=json.dumps(atributos, ensure_ascii=False)
            )

        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error in ExtractProduct: {error_msg}")
            
            # Detectar errores específicos de API Key
            if "API_KEY_INVALID" in error_msg or "400" in error_msg or "expired" in error_msg.lower():
                context.set_code(grpc.StatusCode.UNAUTHENTICATED)
                context.set_details(f"GEMINI_API_KEY_ERROR: {error_msg}")
            else:
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details(f"Extraction error: {error_msg}")
            
            return ai_service_pb2.ProductResponse()

def serve():
    port = os.environ.get('PORT', '50051')
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ai_service_pb2_grpc.add_AIServiceServicer_to_server(AIServiceServicer(), server)
    server.add_insecure_port(f'[::]:{port}')
    
    print("=" * 60)
    print(f"🚀 AI Worker starting on port {port}...")
    print(f"   Model: {GEMINI_MODEL}")
    print("   Mode: Generic Search & Process + Corporate Research Agent")
    
    # DEBUG: Validar qué llave está leyendo
    api_key_check = os.getenv('GEMINI_API_KEY', '')
    if api_key_check:
        print(f"   🔑 Key loaded: {api_key_check[:5]}***{api_key_check[-4:]} (Length: {len(api_key_check)})")
    else:
        print("   🔑 Key loaded: NONE")
        
    print("=" * 60)
    
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
