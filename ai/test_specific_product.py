from extractor import extraer_datos_producto
import json

product_description = "KODAK PIXPRO FZ55-BK - Cámara digital de sensor CMOS de 16 MP con zoom óptico de 5X"

try:
    print(f"🔍 Procesando: {product_description}")
    resultado = extraer_datos_producto(product_description)
    
    print("\n✅ Respuesta de la IA:")
    print(json.dumps({
        "nombre_limpio": resultado.nombre_limpio,
        "marca": resultado.marca,
        "categoria_sugerida": resultado.categoria_sugerida.value if hasattr(resultado.categoria_sugerida, 'value') else str(resultado.categoria_sugerida),
        "atributos": resultado.atributos
    }, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
