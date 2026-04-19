"""
Research Agent de Alta Fidelidad — Investigación Corporativa
Tavily (búsqueda avanzada) → Gemini 2.0 Flash (extracción cero-alucinación) → Proto-safe dict
"""

import json
import re
import requests
from typing import Any

# ─── Zero-Hallucination System Prompt ────────────────────────────
SYSTEM_PROMPT = """### ROL
Eres un Investigador Corporativo Senior especializado en auditoría de datos legales en Latinoamérica (Año 2026).

### TAREA
Extraer información fidedigna de la empresa: {nombre_legal} en el país: {pais}.

### REGLAS DE ORO (SOP DE CALIDAD)
1. NO ALUCINAR: Si un dato no está presente en los resultados de búsqueda, DEBES devolver null. No asumas fechas, no inventes nombres de representantes.
2. PRIORIDAD CRÍTICA: El nombre del Representante Legal y el Sector Económico son fundamentales. Busca específicamente en actas de asamblea o registros mercantiles si están disponibles.
3. FUENTES: Prioriza datos de cámaras de comercio (RUES), registros gubernamentales, DIAN y portales de transparencia.
4. FORMATO: Devuelve exclusivamente un JSON plano con estas claves exactas. Sin texto adicional, sin markdown, sin explicaciones.

### SCHEMA DE SALIDA
{{
  "NombreLegal": "Razón social completa",
  "NombreComercial": "Nombre de marca o null",
  "FechaConstitucion": "YYYY-MM-DD o null",
  "RepresentanteLegal": "Nombre completo del CEO/Gerente o null",
  "Telefonos": "Números de contacto o null",
  "CorreoOficial": "Email de registro o null",
  "CodigoActividadCiiu": "Código numérico o null",
  "CapitalSocial": 0.0,
  "EstadoMatricula": "Activa/Inactiva o null",
  "Sector": "Industrial/Comercio/Servicios etc o null",
  "EstadoCamaraComercio": "Vigente/Cancelada/Activa en Cámara de Comercio o null",
  "UrlEmpleosVerificada": "URL directa a vacantes o null",
  "FuenteDatosOficial": "Nombre del ente regulador consultado"
}}

### DATOS DE BÚSQUEDA (raw)
{raw_data}
"""

# ─── Discovery Prompt (Descubrir empresas activas) ───────────────
DISCOVERY_PROMPT = """### ROL
Eres un Investigador Corporativo Senior especializado en descubrimiento de empresas en Latinoamérica (Año 2026).

### TAREA
Extraer una lista de empresas ACTIVAS del país: {pais}, a partir de los resultados de búsqueda proporcionados.

### REGLAS DE ORO
1. NO ALUCINAR: Solo incluye empresas que aparezcan EXPLÍCITAMENTE en los resultados de búsqueda.
2. SOLO ACTIVAS: Si un resultado indica que una empresa está inactiva, cancelada o cerrada, NO la incluyas.
3. MÁXIMO {limite} empresas en la lista.
4. FORMATO: Devuelve exclusivamente un JSON con la clave "empresas" que contiene un array.

### SCHEMA DE SALIDA
{{
  "empresas": [
    {{
      "NombreLegal": "Razón social completa",
      "NombreComercial": "Nombre de marca o null",
      "FechaConstitucion": "YYYY-MM-DD o null",
      "RepresentanteLegal": "Nombre completo o null",
      "Telefonos": "Números de contacto (busca en secciones de contacto o directorios) o null",
      "CorreoOficial": "Email oficial (busca en avisos legales, contacto o directorios) o null",
      "CodigoActividadCiiu": "Código o null",
      "CapitalSocial": 0.0,
      "EstadoMatricula": "Activa",
      "Sector": "Sector económico o null",
      "EstadoCamaraComercio": "Estatus en Cámara de Comercio",
      "UrlEmpleosVerificada": "URL o null",
      "FuenteDatosOficial": "Nombre del ente consultado"
    }}
  ]
}}

### DATOS DE BÚSQUEDA (raw)
{raw_data}
"""

# ─── Field mapping: Gemini JSON keys → proto field names ─────────
_FIELD_MAP = {
    "NombreLegal": "legal_name",
    "NombreComercial": "commercial_name",
    "FechaConstitucion": "foundation_date",
    "RepresentanteLegal": "legal_representative",
    "Telefonos": "phones",
    "CorreoOficial": "official_email",
    "CodigoActividadCiiu": "ciiu_code",
    "CapitalSocial": "social_capital",
    "EstadoMatricula": "registration_status",
    "Sector": "sector",
    "EstadoCamaraComercio": "chamber_of_commerce_status",
    "UrlEmpleosVerificada": "verified_job_url",
    "FuenteDatosOficial": "official_data_source",
}

# Proto default types per field
_PROTO_DEFAULTS = {
    "legal_name": "",
    "commercial_name": "",
    "foundation_date": "",
    "legal_representative": "",
    "phones": "",
    "official_email": "",
    "ciiu_code": "",
    "social_capital": 0.0,
    "registration_status": "",
    "sector": "",
    "chamber_of_commerce_status": "",
    "verified_job_url": "",
    "official_data_source": "",
    "country": "",
}

GEMINI_MODEL = "gemini-2.5-flash-lite"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


# ─── Cache-First Strategy: Registros Fiscales desde archivo ──────
import pathlib as _pathlib

def _load_fiscal_registries() -> tuple[dict, dict]:
    """Carga registros fiscales desde fiscal_registries.json (Cache-First)."""
    json_path = _pathlib.Path(__file__).parent / "cache-first-strategy" / "fiscal_registries.json"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["registries"], data["default"]

FISCAL_REGISTRIES, _DEFAULT_REGISTRY = _load_fiscal_registries()

MIN_RESULTS_THRESHOLD = 3  # Mínimo de resultados para considerar búsqueda exitosa


class ResearchAgent:
    """
    Orquesta: Tavily search (2 fases) → Gemini extraction → null sanitization.
    Retorna un dict listo para construir un CompanyResponse protobuf.
    """

    def __init__(self, tavily_api_key: str, gemini_api_key: str):
        self.tavily_api_key = tavily_api_key
        self.gemini_api_key = gemini_api_key

    # ── Phase 1: Búsqueda en 2 Fases con Tavily ─────────────────
    def search_company(self, legal_name: str, country: str) -> str:
        """
        Búsqueda en 2 fases:
          1) Registro fiscal oficial del país → fuente más confiable
          2) Si no hay suficientes resultados → búsqueda amplia
        """
        registry = FISCAL_REGISTRIES.get(country, _DEFAULT_REGISTRY)

        # ── Fase 1: Buscar en el registro fiscal oficial ─────────
        query_fiscal = f'"{legal_name}" {registry["keywords"]} {country} representante legal sector'
        print(f"  [Tavily] 🔍 Fase 1 — Fiscal: {registry['fiscal']}")
        print(f"  [Tavily]          Comercial: {registry['commercial']}")
        print(f"  [Tavily]    Query: {query_fiscal}")

        results_fiscal = self._tavily_search(query_fiscal)
        combined = self._format_results(results_fiscal)
        num_fiscal = len(results_fiscal)
        print(f"  [Tavily] ✅ Fase 1 — {num_fiscal} results from fiscal registry")

        # ── Fase 2: Si no hay suficientes, ampliar búsqueda ─────
        if num_fiscal < MIN_RESULTS_THRESHOLD:
            query_broad = f'"{legal_name}" empresa información corporativa {country}'
            print(f"  [Tavily] 🔍 Fase 2 — Búsqueda amplia (insuficientes resultados fiscales)")
            print(f"  [Tavily]    Query: {query_broad}")

            results_broad = self._tavily_search(query_broad)
            combined += self._format_results(results_broad)
            print(f"  [Tavily] ✅ Fase 2 — {len(results_broad)} additional results")

        return combined

    def _tavily_search(self, query: str) -> list[dict]:
        """Ejecuta una búsqueda en Tavily y retorna la lista de resultados."""
        payload = {
            "api_key": self.tavily_api_key,
            "query": query,
            "search_depth": "advanced",
            "max_results": 10,
            "include_raw_content": False,
        }
        response = requests.post(
            "https://api.tavily.com/search", json=payload, timeout=30
        )
        response.raise_for_status()
        return response.json().get("results", [])

    @staticmethod
    def _format_results(results: list[dict]) -> str:
        """Formatea resultados de Tavily en texto plano para Gemini."""
        combined = ""
        for r in results:
            combined += f"\n--- Source: {r.get('url', 'N/A')} ---\n"
            combined += f"Title: {r.get('title', 'N/A')}\n"
            combined += f"Content: {r.get('content', 'N/A')}\n"
        return combined

    # ── Phase 2: Extracción con Gemini (Cero Alucinación) ────────
    def extract_with_gemini(
        self, raw_data: str, legal_name: str, country: str
    ) -> dict[str, Any]:
        """Envía datos crudos a Gemini con el System Prompt de Cero Alucinación."""
        prompt = SYSTEM_PROMPT.format(
            nombre_legal=legal_name,
            pais=country,
            raw_data=raw_data,
        )
        print(f"  [Gemini] 🧠 Extracting structured data for: {legal_name}")
        return self._call_gemini(prompt)

    def _call_gemini(self, prompt: str) -> dict[str, Any]:
        """Llama a Gemini REST y parsea la respuesta JSON."""
        headers = {
            "x-goog-api-key": self.gemini_api_key,
            "Content-Type": "application/json",
        }
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 8192,
            },
        }

        response = requests.post(
            GEMINI_URL, headers=headers, json=payload, timeout=90
        )
        response.raise_for_status()

        data = response.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"  [Gemini] ✅ Response received ({len(raw_text)} chars)")
        # print(f"DEBUG RAW TEXT: {raw_text}") 
        return self._parse_json_response(raw_text)

    # ── Phase 3a: Análisis de empresa individual ─────────────────
    def analyze_company(self, legal_name: str, country: str = "Colombia") -> dict[str, Any]:
        """
        Pipeline completo: Search → Extract → Sanitize.
        Retorna un dict compatible con CompanyResponse protobuf.
        """
        print(f"\n{'='*60}")
        print(f"🏢 Research Agent — Analyzing: {legal_name} ({country})")
        print(f"{'='*60}")

        # Step 1: Tavily search
        raw_data = self.search_company(legal_name, country)

        if not raw_data.strip():
            print("  ⚠️  No search results found, returning defaults")
            result = dict(_PROTO_DEFAULTS)
            result["legal_name"] = legal_name
            result["country"] = country
            return result

        # Step 2: Gemini extraction
        extracted = self.extract_with_gemini(raw_data, legal_name, country)

        # Step 3: Map to proto fields and sanitize nulls
        result = self._map_and_sanitize(extracted, legal_name, country)

        print(f"  ✅ Analysis complete for: {result.get('legal_name', legal_name)}")
        print(f"{'='*60}\n")

        return result

    # ── Phase 3b: Descubrimiento de empresas por país ────────────
    def discover_companies(self, country: str, limit: int = 10) -> dict[str, Any]:
        """
        Descubre empresas ACTIVAS en un país.
        Pipeline: Search registries → Gemini extracts list → Filter actives → Sanitize.
        Retorna dict con 'companies' (list), 'total_found', 'search_source'.
        """
        print(f"\n{'='*60}")
        print(f"🔎 Discovery Agent — Country: {country}, Limit: {limit}")
        print(f"{'='*60}")

        registry = FISCAL_REGISTRIES.get(country, _DEFAULT_REGISTRY)
        search_source = f"{registry['fiscal']} / {registry['commercial']}"

        # Step 1: Búsqueda de empresas activas en registros
        raw_data = self._search_for_companies(country, registry)

        if not raw_data.strip():
            print("  ⚠️  No search results found")
            return {"companies": [], "total_found": 0, "search_source": search_source}

        # Step 2: Gemini extrae la lista de empresas
        prompt = DISCOVERY_PROMPT.format(
            pais=country,
            limite=limit,
            raw_data=raw_data,
        )
        print(f"  [Gemini] 🧠 Extracting company list for: {country} (max {limit})")
        extracted = self._call_gemini(prompt)

        # Step 3: Procesar y realizar INVESTIGACIÓN PROFUNDA individual para cada empresa
        raw_companies = extracted.get("empresas", [])
        companies = []
        
        print(f"  [Discovery] 🔎 Deep researching {min(len(raw_companies), limit)} companies...")
        
        for emp in raw_companies:
            legal_name = emp.get("NombreLegal")
            if not legal_name:
                continue
                
            # Filtrar inactivas basado en la lista inicial (ahorro de tokens/tiempo)
            status = emp.get("EstadoMatricula", "")
            if status and status.lower() in ("inactiva", "cancelada", "cerrada", "disuelta"):
                print(f"  [Discovery] ⛔ Salteada (inactiva): {legal_name}")
                continue

            # --- INVESTIGACIÓN PROFUNDA INDIVIDUAL ---
            # Llamamos a analyze_company para que haga su propia búsqueda en 2 fases
            # y extracción específica para esta empresa.
            print(f"  [Discovery] 🕵️ Deep research starting for: {legal_name}")
            deep_data = self.analyze_company(legal_name, country)
            
            companies.append(deep_data)

            if len(companies) >= limit:
                break

        print(f"  ✅ Discovery complete: {len(companies)} active companies found")
        print(f"{'='*60}\n")

        return {
            "companies": companies,
            "total_found": len(companies),
            "search_source": search_source,
        }

    def _search_for_companies(self, country: str, registry: dict) -> str:
        """Busca listas de empresas activas en los registros de un país."""
        queries = [
            f'empresas registradas activas {registry["keywords"]} {country} 2025 2026 contacto email teléfono',
            f'listado empresas {registry["commercial"]} {country} matrícula activa correo electrónico',
            f'directorio empresarial {country} registro mercantil datos contacto empresas nuevas',
            f'top 10 empresas más grandes {country} 2024 2025 contacto corporativo',
        ]

        combined = ""
        for q in queries:
            print(f"  [Tavily] 🔍 Discovery query: {q}")
            results = self._tavily_search(q)
            combined += self._format_results(results)
            print(f"  [Tavily] ✅ {len(results)} results")

        return combined

    # ── Helpers ───────────────────────────────────────────────────
    @staticmethod
    def _parse_json_response(raw_text: str) -> dict[str, Any]:
        """Extrae JSON de la respuesta de Gemini, maneja markdown code fences."""
        # Strip markdown code block if present
        cleaned = raw_text.strip()
        cleaned = re.sub(r"^```(?:json)?\s*\n?", "", cleaned)
        cleaned = re.sub(r"\n?```\s*$", "", cleaned)
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"  ❌ JSON parse error: {e}")
            print(f"  Raw text: {cleaned[:200]}...")
            return {}

    @staticmethod
    def _map_and_sanitize(
        extracted: dict[str, Any], legal_name: str, country: str
    ) -> dict[str, Any]:
        """
        Mapea claves de Gemini a campos proto y reemplaza null/None
        con los tipos por defecto del .proto ('' para strings, 0.0 para doubles).
        """
        result: dict[str, Any] = {}

        # Map Gemini keys → proto fields
        for gemini_key, proto_field in _FIELD_MAP.items():
            value = extracted.get(gemini_key)
            default = _PROTO_DEFAULTS[proto_field]

            if value is None:
                result[proto_field] = default
            elif proto_field == "social_capital":
                # Ensure numeric type for double field
                try:
                    result[proto_field] = float(value)
                except (ValueError, TypeError):
                    result[proto_field] = 0.0
            else:
                result[proto_field] = str(value)

        # Always set country from request
        result["country"] = country

        # Override legal_name if Gemini returned a better one, fallback to request
        if not result.get("legal_name"):
            result["legal_name"] = legal_name

        return result
