from pydantic import BaseModel, Field
from typing import Dict, Any

class ProductoExtraido(BaseModel):
    """Objeto que representa los datos normalizados de un producto para PostgreSQL."""
    
    nombre_limpio: str = Field(
        ..., 
        description="Clean and concise commercial name of the product. MUST BE TRANSLATED TO ENGLISH."
    )
    
    marca: str = Field(
        ...,
        description="Manufacturer brand (e.g., Sony, Canon, Samsung, Apple). If not found, use 'Generic'."
    )
    
    categoria_sugerida: str = Field(
        ..., 
        description="Simplified logical category in ENGLISH (e.g., Cameras, Televisions, Smartphones, Clothing, Tools, Audio, Photography, Computing)."
    )
    
    atributos: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Additional technical specifications (color, memory, weight, etc.). Standardize KEYS in English (e.g., 'color', 'storage') AND TRANSLATE VALUES TO ENGLISH."
    )
