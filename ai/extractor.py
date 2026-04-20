import os
import instructor
import google.generativeai as genai
from dotenv import load_dotenv
from schemas import ProductoExtraido

# Asegurarse de que las variables de entorno estén cargadas (Forzando ruta absoluta y override)
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(dotenv_path=env_path, override=True)

def extraer_datos_producto(texto_crudo: str) -> ProductoExtraido:
    """Usa Instructor y Gemini para extraer un JSON estricto con marca y categoría dinámica."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY no configurada en el entorno.")
        
    genai.configure(api_key=api_key)
    
    # Usar gemini-2.5-flash-lite para mejor extracción y cuotas estables
    client = instructor.from_gemini(
        client=genai.GenerativeModel("gemini-2.5-flash-lite"),
        mode=instructor.Mode.GEMINI_JSON,
    )

    return client.chat.completions.create(
        response_model=ProductoExtraido,
        messages=[
            {
                "role": "system", 
                "content": """You are an expert in inventory classification and data extraction.
             
REGLAS DE ORO:
1. NAME: Clean, commercial name. MUST BE TRANSLATED TO ENGLISH.
2. BRAND: Extract the actual manufacturer. Use 'Generic' if not found.
3. CATEGORY: Simplified logical category in ENGLISH (e.g., Cameras, Televisions, Smartphones, Clothing, Tools, Audio, Photography, Computing).
4. ATTRIBUTES: Dictionary with keys in ENGLISH (color, size, storage, resolution, etc.) and TRANSLATE ALL VALUES TO ENGLISH.

EXAMPLE 1:
Input: "Canon EOS Rebel T7 Cámara DSLR con lente de 18-55mm | Wi-Fi integrado"
Output: {
  "nombre_limpio": "EOS Rebel T7 DSLR Camera",
  "marca": "Canon",
  "categoria_sugerida": "Cameras",
  "atributos": { "lens": "18-55mm", "connectivity": "Wi-Fi" }
}

EXAMPLE 2:
Input: "SAMSUNG - Smart TV Full HD de 32 color rojo"
Output: {
  "nombre_limpio": "32-inch Full HD Smart TV",
  "marca": "Samsung",
  "categoria_sugerida": "Televisions",
  "atributos": { "size": "32", "color": "red" }
}"""
            },
            {"role": "user", "content": f"Extrae los datos de este producto: {texto_crudo}"}
        ],
    )
