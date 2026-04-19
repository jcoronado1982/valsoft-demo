import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Add src to path for engine import
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ai-worker-python', 'src'))
from core.engine import ResearchAgent

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ai-worker-python', '.env'))

# Database connection details (fetching from env)
DB_PARAMS = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'database': os.getenv('DB_NAME', 'inventory_db'),
    'user': os.getenv('DB_USER', 'user'),
    'password': os.getenv('DB_PASSWORD', 'password')
}

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

def find_websites():
    if not GEMINI_API_KEY or not TAVILY_API_KEY:
        print("Error: GEMINI_API_KEY or TAVILY_API_KEY not found in environment")
        return

    print("Connecting to database...")
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor(cursor_factory=RealDictCursor)
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return

    # User's provided query
    query = """
    SELECT web, email, c.nit, razon_social 
    FROM companies c 
    WHERE 
        email LIKE '%%@gmail.com%%' OR 
        email LIKE '%%@hotmail.com%%' OR 
        email LIKE '%%@outlook.com%%' OR 
        email LIKE '%%@yahoo.com%%' OR 
        email LIKE '%%@yahoo.es%%' OR 
        email LIKE '%%@live.com%%' OR 
        email LIKE '%%@icloud.com%%' OR
        email LIKE '%%@yopmail.com%%';
    """

    print("Fetching companies with generic emails...")
    cur.execute(query)
    companies = cur.fetchall()
    print(f"Found {len(companies)} companies to process.")

    agent = ResearchAgent(TAVILY_API_KEY, GEMINI_API_KEY)

    for company in companies:
        nit = company['nit']
        razon_social = company['razon_social']
        print(f"\n--- Processing: {razon_social} (NIT: {nit}) ---")

        try:
            # We want to find the real website. 
            # The agent.analyze_company finds name, email, phones, and official_data_source.
            # But the agent logic already searches for the company in Tavily.
            # We can use the agent's internal search + extraction to get the website if we modify the prompt,
            # or just use the agent's analyzed data to see if it found a "UrlOficial" if we added it to the schema.
            # Looking at engine.py SYSTEM_PROMPT, it doesn't have a "UrlOficial" key in SCHEMA DE SALIDa, 
            # but it has "FuenteDatosOficial".
            # Actually, I should probably check if the agent can be tweaked to return the official website.
            
            # For now, let's use the search results and ask Gemini to specifically find the domain.
            search_results = agent.search_company(razon_social, "Colombia")
            
            discovery_prompt = f"""
            Basado en la siguiente información de búsqueda para la empresa "{razon_social}" en Colombia,
            encuentra únicamente el SITIO WEB OFICIAL (dominio real) de la empresa.
            
            INFORMACIÓN DE BÚSQUEDA:
            {search_results}
            
            REGLAS:
            1. Devuelve únicamente el dominio (ej. empresa.com) o null si no lo encuentras con certeza.
            2. Prioriza sitios corporativos propios sobre perfiles de LinkedIn o directorios.
            3. No inventes.
            
            RESPUESTA (JSON):
            {{
                "web": "dominio.com o null"
            }}
            """
            
            result = agent._call_gemini(discovery_prompt)
            web_found = result.get("web")

            if web_found and web_found.lower() != "null":
                print(f"✅ Found real website: {web_found}")
                
                # Update database
                update_query = "UPDATE companies SET web = %s WHERE nit = %s"
                cur.execute(update_query, (web_found, nit))
                conn.commit()
                print(f"💾 Database updated for {razon_social}")
            else:
                print(f"⚠️  Real website not found for {razon_social}")

        except Exception as e:
            print(f"❌ Error processing {razon_social}: {e}")

    cur.close()
    conn.close()
    print("\nProcessing complete!")

if __name__ == "__main__":
    find_websites()
