from extractor import extraer_datos_producto
import json

def main():
    producto_entrada = "DEWALT Juego de Taladro Atornillador Inalámbrico de 20V Max, 2 Velocidades"
    print(f"🔍 Procesando: '{producto_entrada}'...")
    
    try:
        resultado = extraer_datos_producto(producto_entrada)
        print("\n✅ Extracción Exitosa:")
        print(json.dumps(resultado.model_dump(), indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
