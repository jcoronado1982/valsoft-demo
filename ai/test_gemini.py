import os
import google.generativeai as genai
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener la llave
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: No se encontró GEMINI_API_KEY en el entorno.")
    exit(1)

print(f"🔄 Conectando a Gemini con la llave: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key)
    
    target_model = "gemini-2.5-flash-lite"
    print(f"✅ Usando modelo solicitado: {target_model}")
    
    model = genai.GenerativeModel(target_model)
    response = model.generate_content("Hola, confirma conexión.")
    
    print("\n✅ Conexión exitosa!")
    print(f"🤖 Respuesta: {response.text}")

except Exception as e:
    print(f"\n❌ Fallo en la conexión: {str(e)}")
