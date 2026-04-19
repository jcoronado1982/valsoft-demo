import pytest
from extractor import extraer_datos_producto
from schemas import ProductoExtraido, CategoriaProducto

@pytest.mark.parametrize("input_text, expected_keyword, expected_cat", [
    # Prueba en Español
    ("Televisor Samsung 55 pulgadas qled 4k modelo 2025", "Samsung", CategoriaProducto.TELEVISION),
    # Prueba en Inglés / Spanglish
    ("Apple - iPhone 17 Pro Max, 256 GB, eSIM, dark blue", "iPhone", CategoriaProducto.PHONE),
    # Prueba de Herramienta
    ("Martillo Irwin fibra de vidrio 16oz uso general", "Irwin", CategoriaProducto.TOOL)
])
def test_extraccion_multilingue(input_text, expected_keyword, expected_cat):
    """Valida que la IA categorice en Inglés sin importar el idioma de entrada."""
    resultado = extraer_datos_producto(input_text)
    
    assert isinstance(resultado, ProductoExtraido)
    assert resultado.nombre_limpio != ""
    assert expected_keyword.lower() in resultado.nombre_limpio.lower()
    # Validamos que la categoría es el estándar en inglés
    assert resultado.categoria_sugerida == expected_cat

def test_verificar_atributos_ingles():
    """Asegura que las claves de los atributos se estandaricen al inglés."""
    entrada = "Computadora portátil ASUS ROG Zephyrus, 16GB de memoria, tarjeta gráfica RTX 4070"
    resultado = extraer_datos_producto(entrada)
    
    assert isinstance(resultado.atributos, dict)
    # La IA debió traducir "memoria" a "ram" o "memory" y mantener el valor "16GB"
    claves_str = str(resultado.atributos.keys()).lower()
    assert "memory" in claves_str or "ram" in claves_str
    assert "ASUS" in resultado.nombre_limpio
    assert resultado.categoria_sugerida == CategoriaProducto.COMPUTING

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
